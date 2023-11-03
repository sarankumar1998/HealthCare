import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, TextField, Typography, Grid } from '@mui/material';
import Slots from './Slots';
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";

if (typeof window !== "undefined") {
    injectStyle();
  }


function DoctorHome() {

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState([]);
  const { id } = JSON.parse(sessionStorage.getItem("user"));


  
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  useEffect(() => {
    // Make the GET request using axios
    axios.get(`http://192.168.0.78:5000/api/v3/getDoctorAppointments?doctorId=${id}`)
      .then(response => {
        setDoctorAppointments(response.data.doctorAppointments);
      })
      .catch(error => {
        console.error('Error fetching doctor appointments:', error);
      });
  }, [id]);

  const formatAppointmentTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  const handleSetAvailability = () => {
    const payload = {
      doctorId: id,
      date: date,
      startTime: startTime,
      endTime: endTime
    };

    axios.post('http://192.168.0.78:5000/api/v3/setAvailability', payload)
      .then(response => {
        toast.success(response.data.message);
        fetchAvailability()
        
      })
      .catch(error => {
        console.error('Error setting availability:', error);
        toast.warning(error.response.data.message);
      });
  };
  const fetchAvailability = () => {
    axios.get(`http://192.168.0.78:5000/api/v3/getAvailability/${id}`)
      .then(response => {
        setAvailability(response.data)
      })
      .catch(error => {
        console.error('Error fetching availability:', error);
      });
  };

  useEffect(() => {
    fetchAvailability();
}, [id]);

  return (
    <>
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Set Doctor Availability
      </Typography>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Start Time"
            type="time"
            variant="outlined"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="End Time"
            type="time"
            variant="outlined"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            margin="normal"
          />
        </Grid>
      </Grid>
      
      <Button variant="contained" color="primary" className='mt-3' onClick={handleSetAvailability}>
        Set Availability
      </Button>
    

    </Container>
 <div className='mt-5'><Slots availability={availability} formatAppointmentTime={formatAppointmentTime} doctorAppointments={doctorAppointments}/></div>
    </>
  );
}

export default DoctorHome;




