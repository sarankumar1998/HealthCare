import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';

function PatientSignup() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    gender: '',
    dob: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post('http://192.168.10.117:5000/api/v2/patientSignup', formData)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} className="p-4">
        <Typography variant="h5" align="center" gutterBottom>
          Registration
        </Typography>
   
        <TextField
          label="First Name"
          name="firstname"
          fullWidth
          required
          value={formData.firstname}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastname"
          fullWidth
          required
          value={formData.lastname}
          onChange={handleChange}
          margin="normal"
        />
                <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={formData.dob}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Gender"
          name="gender"
          select
          fullWidth
          required
          value={formData.gender}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
      </Paper>
    </Container>
  );
}

export default PatientSignup;
