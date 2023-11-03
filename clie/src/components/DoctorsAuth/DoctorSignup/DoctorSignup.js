import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";
import { Container, Paper, Grid, TextField, Checkbox, Button, Select, MenuItem, FormControlLabel } from '@mui/material';

const BackendBaseUrl = 'http://localhost:5000'; // Update with your backend server URL
  // CALL IT ONCE IN YOUR APP
  if (typeof window !== "undefined") {
    injectStyle();
  }


function DoctorSignup() {
 const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  const [getData, setData] = useState([]);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    specialist: '',
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/specialties")
      .then((res) => {
        setData(res.data)
      })
  }, []);


  
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignup = () => {
    // Validate inputs before sending the request
    const newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!licenseNumber) newErrors.licenseNumber = 'License Number is required';
    if (!specialist) newErrors.specialist = 'Specialist is required';

    setErrors(newErrors);

    // If there are errors, don't proceed with the signup
    if (Object.keys(newErrors).length > 0) return;

    // Determine the sex based on checkboxes
    const sexValue = isMale ? 'M' : (isFemale ? 'F' : '');

    axios
      .post('http://192.168.10.117:5000/api/v1/doc', {
        gender: sexValue,
        name,
        email,
        password,
        medical_license_number: licenseNumber,
        specialist,
      })
      .then(response => {
        if (response.status === 200) {
            toast.success(response.data);
            setTimeout(() => {
            navigate("/doctorLogin");
            }, 2000);
          }

      })
      .catch(error => {
        console.error('Error signing up:', error);
        toast.warning(error.response.data);
      });
  };

  return (
    <Container maxWidth="sm" className='mt-4'>
      <Paper elevation={3} sx={{ padding: 2 }}>
      <ToastContainer />
        <h2>Doctor Signup</h2>
        <TextField label="Name" className='mt-2' fullWidth value={name} onChange={(e) => setName(e.target.value)} error={!!errors.name} helperText={errors.name} />
        <TextField label="Email" className='mt-2' fullWidth value={email} onChange={(e) => setEmail(e.target.value)}  error={!!errors.email || (email && !validateEmail(email))}
          helperText={errors.email || (email && !validateEmail(email)) ? 'Invalid email format' : ''} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={isMale} onChange={() => { setIsMale(!isMale); setIsFemale(false); }} />}
              label="Male"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={isFemale} onChange={() => { setIsFemale(!isFemale); setIsMale(false); }} />}
              label="Female"
            />
          </Grid>
        </Grid>
        <TextField label="Medical License Number" className='mt-2'  fullWidth value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} error={!!errors.licenseNumber} helperText={errors.licenseNumber} />
        <Select className='mt-2' value={specialist} onChange={(e) => setSpecialist(e.target.value)} fullWidth error={!!errors.specialist} >
          <MenuItem value="">Select a specialist</MenuItem>
          {getData.map(specialty => (
            <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
          ))}
        </Select>
        <TextField label="Password" className='mt-2' fullWidth value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} />

        <Button className='mt-4' variant="contained" color="primary" onClick={handleSignup}>Sign Up</Button>
      </Paper>
    </Container>
  );
}

export default DoctorSignup;
