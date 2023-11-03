import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Chip,
    Avatar,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function ApptDialog({ doctorUniqId, id, dialogOpen, handleCloseDialog, selectedDate, doctorsAvailability, setSelectedStartTime, handleBooking }) {
    const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);
    const [displayStartDate, setDisplayStartDate] = useState(new Date(selectedDate));
    const displayEndDate = new Date(displayStartDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later

    useEffect(() => {
        const doctorInfo = doctorsAvailability.find(doctor => doctor.doctorId === doctorUniqId);
        setSelectedDoctorInfo(doctorInfo);

        // Update displayStartDate based on the selectedDate
        setDisplayStartDate(new Date(selectedDate));
    }, [doctorsAvailability, doctorUniqId, selectedDate]);

    const getAvailableSlotsForDate = (date) => {
        if (selectedDoctorInfo) {
            const availabilityItem = selectedDoctorInfo.availability.find(item => item.dates[0] === date);
            return availabilityItem ? availabilityItem.startTimes : [];
        }
        return [];
    };

    
    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(":");
        const parsedHours = parseInt(hours, 10);
        const ampm = parsedHours >= 12 ? "PM" : "AM";
        const twelveHour = parsedHours % 12 || 12;
        return `${twelveHour}:${minutes} ${ampm}`;
    };

    const formatSelectedDate = (startDate, endDate) => {
        const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
        const startDay = startDate.getDate();
        const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
        const endDay = endDate.getDate();
        return `${startMonth} ${startDay} to ${endMonth} ${endDay}`;
    };



    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle style={{ margin: "1rem", borderBottom: "2px grey solid", display: "flex", alignItems: "center" }}>
                    {selectedDoctorInfo ? (
                        <Avatar
                            alt={`Dr. ${selectedDoctorInfo.doctorName}`}
                            src={selectedDoctorInfo.doctorImageURL} // Replace with the actual image URL
                            style={{ marginRight: "1rem", marginTop: "-2rem", height: '5rem', width: "5rem" }}
                        />
                    ) : null}
                    <div>
                        <Typography style={{ fontSize: '18px', fontWeight: "550" }}>
                            {selectedDoctorInfo ? `Dr. ${selectedDoctorInfo.doctorName}` : "Doctor Name"}
                        </Typography>
                        <Typography style={{ fontSize: '16px' }} variant="body2">
                            {selectedDoctorInfo ? selectedDoctorInfo.specialist : "Specialist"}
                        </Typography>
                        <Typography variant="body2" style={{ color: "grey" }}>33 N Fullerton Ave Montclair NJ 07042</Typography>
                        <Typography variant="body2" style={{ color: "grey" }}>  Choose a time with Dr. Lerner that works for you</Typography>
                        <Typography variant="body3" style={{ fontWeight: "550", marginTop: "1rem", marginLeft: "-5rem" }}>
                            {selectedDate && formatSelectedDate(displayStartDate, displayEndDate)}
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent style={{ margin: "1rem" }}>
                {selectedDoctorInfo && selectedDoctorInfo.availability.map((availabilityItem, index) => {
                    const slotDate = new Date(availabilityItem.dates[0]);
                    const startDate = new Date(selectedDate);
                    const endDate = new Date(selectedDate);
                    endDate.setDate(startDate.getDate() + 7); // Change to 7 days later

                    if (slotDate >= startDate && slotDate <= endDate) {
                        return (
                            <div key={index}>
                                <Typography style={{ fontSize: '15px' }} variant="body2">
                                    {slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                                {getAvailableSlotsForDate(availabilityItem.dates[0]).map((startTime, slotIndex) => (
                                    <Chip
                                        style={{ padding: "0.5rem", fontSize: "15px", borderRadius: "2px", margin: '0.3rem', background: "yellow" }}
                                        key={slotIndex}
                                        label={convertTo12HourFormat(startTime)} // Convert time to 12-hour format
                                        className="mt-2"
                                        onClick={() => {
                                            setSelectedStartTime(startTime);
                                            handleBooking(doctorUniqId, id, availabilityItem.dates[0],availabilityItem.startTimes);
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    } else {
                        return null; // Do not render slots outside the selected date range
                    }
                })}
            </DialogContent>

            </Dialog>
        </div>
    );
}
