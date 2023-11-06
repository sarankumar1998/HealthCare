import React, { useState, useEffect } from 'react';
import './PatientsBooking.css';


import axios from 'axios';
import {
    Card,
    CardContent,
    Chip,
    Container,
    Typography,

} from '@mui/material';
import ApptDialog from './Dialog/ApptDialog';

function PatientsBooking() {
    const [doctorsAvailability, setDoctorsAvailability] = useState([]);
    const [selectedStartTimes, setSelectedStartTimes] = useState([]);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [doctorUniqId, setDoctorUniqId] = useState(null);
    const { id } = JSON.parse(sessionStorage.getItem("user"));
console.log(selectedDate);

    useEffect(() => {
        axios.get('http://192.168.0.78:5000/api/v3/getAvailability')
            .then(response => {
                setDoctorsAvailability(response.data);
            })
            .catch(error => {
                console.error('Error fetching doctors availability:', error);
            });
    }, []);

    const handleBooking = (doctorUniqId, id,date,startTimes) => { // Use the date parameter

        console.log(doctorUniqId, id,date,startTimes);
        if (selectedStartTime && selectedDate) {
            const timeslot = ` ${selectedStartTime}:00`; // Construct the timeslot
            console.log(timeslot);
            const requestData = {
                doctorId: doctorUniqId,
                patientId: id,
                bookTime: timeslot, // Use the constructed timeslot
                bookDate: selectedDate
            };

            const confirmed = window.confirm('Are you sure you want to book this appointment?');

    
            if (confirmed) {
                axios.post('http://192.168.0.78:5000/api/v3/bookAppointment', requestData)
                    .then(response => {
                        console.log('Appointment booked successfully:', response.data.message);
                        // Handle UI updates after successful booking if needed.
                    })
                    .catch(error => {
                        console.error('Error booking appointment:', error);
                    });
            } else {
                console.log('Booking was not confirmed.');
            }
        }
    };



    const handleChipClick = ( startTimes, doctorId,selectedDate) => {
        setSelectedDate(selectedDate);
        setSelectedStartTimes(startTimes);
        setDoctorUniqId(doctorId);
        setSelectedStartTime(null); // Reset selected start time
        setDialogOpen(true);

    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Container maxWidth="md">
            <div>
                {doctorsAvailability.map(doctor => (
                    <div key={doctor.doctorName} className="mb-4">
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <div className="d-flex justify-content-between mb-3">
                                    <div className='chips'>
                                        <Typography variant="h6">Dr. {doctor.doctorName}</Typography>
                                        <Typography variant="body1">{doctor.specialist}</Typography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12 chip">
                                        {doctor.availability.map((availabilityItem, index) => (
                                            <Chip
                                            className="mt-2 "
                                                // style={{  }}
                                                sx={{ borderRadius: '0' }}
                                                key={index}
                                                label={<>  {new Date(availabilityItem.dates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    <br />
                                                    {availabilityItem.startTimes.length} Appts </>}
                                                onClick={() => handleChipClick( availabilityItem.startTimes , doctor.doctorId, availabilityItem.dates[0])}
                                             
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>.
                        <ApptDialog
                            dialogOpen={dialogOpen}
                            selectedDate={selectedDate}
                            setSelectedStartTime={setSelectedStartTime}
                            selectedStartTimes={selectedStartTimes}
                            selectedStartTime={selectedStartTime}
                            id={id}
                            doctorUniqId={doctorUniqId}
                            handleCloseDialog={handleCloseDialog}
                            doctorsAvailability={doctorsAvailability}
                            handleBooking={handleBooking} // Pass recentClickedDate here
                        />
                    </div>
                ))}
            </div>


        </Container>
    );
}

export default PatientsBooking;
