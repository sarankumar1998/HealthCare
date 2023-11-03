const express = require("express");
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();



const specialtiesList = ['Cardiologist', 'Dermatologist', 'Endocrinologist', 'Gastroenterologist', 'Neurologist', 'Oncologist', 'Pediatrician', 'Psychiatrist', 'Surgeon'];

// API endpoint to fetch doctor specialties
router.get('/specialties', (req, res) => {
    res.json(specialtiesList);
    console.log(specialtiesList);
});

router.post('/doc', async (req, res) => {
    const {
        name,
        email,
        password,
        medical_license_number,
        specialist,
        gender
    } = req.body;

    // Check if any required field is missing or empty
    if (!name || !email || !password || !medical_license_number || !specialist || !gender) {
        return res.status(400).json("All fields are required.");
    }

    // CHECK IF USER ALREADY EXISTS
    const alreadyUserQuery = "SELECT * FROM doctors WHERE email = ?";

    db.query(alreadyUserQuery, [email], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.length) {
            return res.status(409).json("User already exists!");
        }

        const newUserQuery =
            "INSERT INTO doctors (`name`,`email`,`password`,`medical_license_number`,`specialist`,`gender`) VALUE (?,?,?,?,?,?)";

        const values = [name, email, password, medical_license_number, specialist, gender];

        db.query(newUserQuery, values, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json("Internal Error");
            } else {
                return res.status(200).json("Account has been created.");
            }
        });
    });
});


router.post('/log', async (req, res) => {
    const userLogin = 'SELECT * FROM doctors WHERE email = ?';
    db.query(userLogin, [req.body.email], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (data.length === 0) {
            return res.status(404).json('User not found!');
        }

        let doctor = data[0];
        if (req.body.password !== doctor.password) {
            return res.status(400).json('Wrong password or username!');
        }

        // Update last_login for successful login
        const loginTime = new Date();
        const updateLastLoginQuery = 'UPDATE doctors SET last_login = ? WHERE id = ?';
        db.query(updateLastLoginQuery, [loginTime, doctor.id], (updateError, updateResult) => {
            if (updateError) {
                console.error(updateError);
                return res.status(500).json({ message: 'Error updating login time' });
            } else {
                // Sign the token
                const token = jwt.sign({ id: doctor.id, email: doctor.email }, 'secretkey', { expiresIn: '1200s' });
                doctor.token = token;

                res.status(200).json({ ...doctor, token });
            }
        });
    });
});



//   router.post('/logout', (req, res) => {
//     const { doctorId } = req.body; 

//     const logoutTime = new Date(); // Get the current time

//     const updateLastLoginQuery = 'UPDATE doctors SET last_login = ? WHERE id = ?';
//     db.query(updateLastLoginQuery, [logoutTime, doctorId], (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating logout time' });
//       } else {
//         res.status(200).json({ message: 'Doctor logged out successfully' });
//       }
//     });
//   });



module.exports = router;


