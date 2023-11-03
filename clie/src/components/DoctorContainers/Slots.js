import React, { useState, useEffect } from 'react';
import { Card, CardContent, Chip, Container, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';


function Slots({ availability, doctorAppointments }) {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPatientTime, setSelectedPatientTime] = useState(null);



const handleClickChip = (slot, dates) => {
    setSelectedSlot(slot);
    setOpenDialog(true);

    const formattedSlot = slot; // Format slot to match booktime format
    const matchingAppointments = doctorAppointments?.filter(appointment =>
        appointment.bookdate === dates && appointment.booktime === formattedSlot
    );

        console.log('Matching Appointments:', matchingAppointments);
        console.log('Appointment Times:', doctorAppointments?.map(appointment => appointment.bookdate === dates));
    
    const appointmentInfo = matchingAppointments.map(appointment => `${appointment.booktime} - ${appointment.patientName}`).join('\n');

    setSelectedPatientTime(matchingAppointments.length > 0
        ? appointmentInfo
        : 'No appointment booked');
};

   
    const handleCloseDialog = () => {
        setSelectedSlot(null);
        setSelectedPatientTime(null);
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md">
               <Grid container spacing={3}>
                {availability.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={11}>
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <h6 align="left">Date: {item.dates[0]}</h6>
                                <p style={{ color: 'grey', fontSize: '13px' }} align="left">
                                    Upcoming Appointments
                                </p>
                                <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                                        {item.startTimes.map((startTime, timeIndex) => {
                                            const formattedStartTime = startTime; 
                                            const matchingAppointments = doctorAppointments?.filter(
                                                (appointment) =>    appointment.bookdate === item.dates[0] && appointment.booktime === formattedStartTime
                                            );

                                            const isBooked = matchingAppointments.length > 0;

                                            return (
                                                <Badge color="secondary" badgeContent={matchingAppointments.length} key={timeIndex}>
                                                    <Chip
                                                        style={{
                                                            padding: "0.5rem",
                                                            fontSize: "15px",
                                                            borderRadius: "2px",
                                                            margin: "0.3rem",
                                                            background: isBooked ? "#2196f3" : "yellow",
                                                        }}
                                                        label={startTime}
                                                        variant={isBooked ? "secondary" : "outlined"}
                                                        color={isBooked ? "primary" : "default"}
                                                        className="mt-2"
                                                        onClick={() => handleClickChip(startTime, item.dates[0])}
                                                    />
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                ))}
            </Grid>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle style={{background:"#ecfccc"}}>Selected Slot Information
                <Typography style={{ color: 'grey', fontSize: '13px' }} >
                        {selectedSlot ? `You clicked on the slot: ${selectedSlot}` : 'No slot selected'}
                        </Typography></DialogTitle>
                <DialogContent>
                
                        <Typography>

                        {selectedPatientTime && (
                            <div className='mt-4'>
                                {selectedPatientTime === 'No appointment booked'
                                    ? selectedPatientTime
                                    : `Patient Booking Times:  ${selectedPatientTime }`}

                                    
                            </div>
                        )}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default Slots;
