import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";


function PatientLogin() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
        setLoading(true);
        axios
            .post('http://192.168.10.117:5000/api/v2/patientLogin', formData)
            .then((response) => {
                setTimeout(() => {
                    navigate("/patientsBooking");
                }, 2000);
                console.log(response.data);
                setLoading(false);
                const PatientData = {
                    id: response.data.id,
                };

                console.log(PatientData);

                sessionStorage.setItem("user", JSON.stringify(PatientData));
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
                    To log in, enter your email Credentials
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </Paper>
        </Container>
    );
}

export default PatientLogin;
