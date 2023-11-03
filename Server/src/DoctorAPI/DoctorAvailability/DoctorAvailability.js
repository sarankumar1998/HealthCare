const express = require("express");
const db = require("../../db/db");
const router = express.Router();

router.post('/setAvailability', (req, res) => {
  const { doctorId, date, startTime, endTime } = req.body;

  if (!doctorId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if the date is already available for the doctor
  const dateCheckQuery = `
    SELECT * FROM doctor_availability
    WHERE doctor_id = ? AND date = ?`;
  
  db.query(dateCheckQuery, [doctorId, date], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error checking date availability' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Date already available for the doctor' });
    }

    const availableSlots = [];
    const currentTime = new Date(`${date}T${startTime}`);
    const endTimeObj = new Date(`${date}T${endTime}`);

    while (currentTime <= endTimeObj) {
      const formattedStartTime = currentTime.toLocaleTimeString('en-US', { hour12: false });
      const formattedEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000).toLocaleTimeString('en-US', { hour12: false });

      availableSlots.push({
        doctor_id: doctorId,
        date: date,
        start_time: formattedStartTime,
        end_time: formattedEndTime
      });

      currentTime.setHours(currentTime.getHours() + 1);
    }

    if (availableSlots.length === 0) {
      return res.status(400).json({ message: 'No availability slots provided' });
    }

    const values = availableSlots.map(slot => `(${slot.doctor_id}, '${slot.start_time}', '${slot.end_time}', '${slot.date}')`).join(',');

    const query = `
      INSERT INTO doctor_availability (doctor_id, start_time, end_time, date)
      VALUES ${values}`;

    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error setting availability' });
      } else {
        res.json({ message: 'Availability set successfully' });
      }
    });
  });
});



// API endpoint to get availability slots for a specific doctor
router.get('/getAvailability/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId;

  if (!doctorId) {
    return res.status(400).json({ message: 'Missing doctorId' });
  }

  const query = `
    SELECT DATE_FORMAT(date, '%Y-%m-%d') AS availabilityDate,
           GROUP_CONCAT(DATE_FORMAT(start_time, '%h:%i %p')) AS startTimes
    FROM doctor_availability
    WHERE doctor_id = ?
    GROUP BY date`;

  db.query(query, [doctorId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting availability' });
    } else {
      const availability = results.map(item => ({
        dates: [item.availabilityDate],
        startTimes: item.startTimes.split(',')
      }));

      res.json(availability);
    }
  });
});


// for patient
router.get('/getAvailability', (req, res) => {
  const query = `
    SELECT d.id AS doctorId, d.name AS doctorName,
           d.specialist AS doctorSpecialist,
           DATE_FORMAT(da.date, '%Y-%m-%d') AS availabilityDate,
           GROUP_CONCAT(DATE_FORMAT(da.start_time, '%H:%i')) AS startTimes
    FROM doctor_availability da
    INNER JOIN doctors d ON da.doctor_id = d.id
    GROUP BY d.id, da.date`;

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting availability' });
    } else {
      const availability = results.reduce((acc, item) => {
        const existingDoctor = acc.find(doc => doc.doctorName === item.doctorName);
        
        if (existingDoctor) {
          existingDoctor.availability.push({
            dates: [item.availabilityDate],
            startTimes: item.startTimes.split(',')
          });
        } else {
          acc.push({
            doctorId:item.doctorId,
            doctorName: item.doctorName,
            specialist: item.doctorSpecialist,
            availability: [{
              dates: [item.availabilityDate],
              startTimes: item.startTimes.split(',')
            }]
          });
        }

        return acc;
      }, []);

      res.json(availability);
    }
  });
});


// API endpoint to book an appointment
router.post('/bookAppointment', (req, res) => {
  const { doctorId, patientId, bookDate,bookTime} = req.body;
  const query = `
    INSERT INTO appointments (doctor_id, patient_id, book_date, book_time)
    VALUES (${doctorId}, ${patientId},'${bookDate}','${bookTime}')
  `;
  
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error booking appointment' });
    } else {
      res.json({ message: 'Appointment booked successfully' });
    }
  });
});

// API endpoint to get booked appointments for a doctor along with patient names
router.get('/getDoctorAppointments', (req, res) => {
  const { doctorId } = req.query;

  const query = `
    SELECT a.book_date AS bookdate, a.book_time AS booktime, p.firstname AS patientName
    FROM appointments a
    INNER JOIN patients p ON a.patient_id = p.id
    WHERE a.doctor_id = ${doctorId}
  `;
  
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting doctor appointments' });
    } else {
      const doctorAppointments = results.map(item => ({
        bookdate: formatDate(item.bookdate), // Format the date using formatDate function
        booktime: parseTime(item.booktime),
        patientName: item.patientName,
      }));
      res.json({ doctorAppointments });
    }
  });
});

// Function to parse the time string and return a formatted time
function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 === 0 ? 12 : hours % 12).toString().padStart(2, '0');

  return `${formattedHours}:${minutes} ${ampm}`;
}

// Function to format date string as 'YYYY-MM-DD'
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}




module.exports = router;
