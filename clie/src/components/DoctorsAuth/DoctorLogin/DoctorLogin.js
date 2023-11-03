import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";


  // CALL IT ONCE IN YOUR APP
  if (typeof window !== "undefined") {
    injectStyle();
  }
function DoctorLogin() {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://192.168.10.117:5000/api/v1/log', {
      email,
      password
    }).then(response => {
        if (response.status === 200) {
            setTimeout(() => {
              navigate("/doctorHome");
            }, 2000);
          }
          const DoctorData = {
            id: response.data.id, // Use response.data.id from the API response
          };

          console.log(DoctorData);
  
          sessionStorage.setItem("user", JSON.stringify(DoctorData));
    //   const doctor = response.data;
    //   const token = doctor.token;
    //   // Do something with the token, such as storing it in local storage or Redux state
    //   console.log('Login successful!', token, doctor);
    }).catch(error => {
      if (error.response) {
        console.error('Login failed:', error.response.data);
        toast.warning(error.response.data);
      } else {
        console.error('Login failed: An error occurred');
      }
      // Handle login error, show error message to the user, etc.
    });
  };

  return (
    <Container maxWidth="xs" className="mt-5">
      <Paper elevation={3} className="p-4">
      <ToastContainer />    
        <Typography variant="h5" align="center" gutterBottom>
          Logins
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default DoctorLogin;