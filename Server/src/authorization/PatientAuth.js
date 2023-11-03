const express = require("express");
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();



router.post('/patientSignup', async (req, res) => {
    const {
        email,
        password,
        firstname,
        lastname,   
        gender,
        dob
    } = req.body;

    // Check if any required field is missing or empty
if ( !email || !password || !firstname || !lastname || !gender || !dob) {
    console.log(res.status(400).json);
        return res.status(400).json("All fields are required.");
    }

    // CHECK IF USER ALREADY EXISTS
    const alreadyUserQuery = "SELECT * FROM patients WHERE email = ?";

    db.query(alreadyUserQuery, [email], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.length) {
            return res.status(409).json("Account already exists!");
        }

        const newUserQuery =
            "INSERT INTO patients (`email`,`password`,`firstname`,`lastname`,`gender`,`dob`) VALUE (?,?,?,?,?,?)";

        const values = [
            email,
            password,
            firstname,
            lastname,
            gender,
            dob,
           
            ];

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


router.post('/patientLogin', async (req, res) => {
    const { email, password } = req.body;

    // CHECK IF USER EXISTS
    const userQuery = "SELECT * FROM patients WHERE email = ?";

    db.query(userQuery, [email], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.length === 0) {
            return res.status(404).json('User not found!');
        }

        const patient = data[0];

        // Check if provided password matches
        if (password !== patient.password) {
            return res.status(400).json('Wrong password or username!');
        }

        // Update last_login for successful login
        const loginTime = new Date();
        const updateLastLoginQuery = 'UPDATE patients SET last_login = ? WHERE id = ?';
        db.query(updateLastLoginQuery, [loginTime, patient.id], (updateError, updateResult) => {
            if (updateError) {
                console.error(updateError);
                return res.status(500).json({ message: 'Error updating login time' });
            } else {
                // Generate and sign a JWT token
                const token = jwt.sign({ id: patient.id, email: patient.email }, 'secretkey', { expiresIn: '1200s' });

                res.status(200).json({ ...patient, token });
            }
        });
    });
});




//   router.post('/logout', (req, res) => {
//     const { doctorId } = req.body; 

//     const logoutTime = new Date(); // Get the current time

//     const updateLastLoginQuery = 'UPDATE patients SET last_login = ? WHERE id = ?';
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


