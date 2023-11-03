import React from 'react';
import { Container } from '@mui/material';

import Navbar from '../Navbar/Navbar';

function Landing() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ backgroundColor: '#fff5e1' }}>

            <Container className="mt-5 text-center">
                <h2>Our Services</h2>
                <p>
                    We offer a wide range of medical services, including diagnostics, treatments, surgeries, and more.
                </p>
            </Container>

            <Container className="mt-5 text-center">
                <h2>Experienced Doctors</h2>
                <p>
                    Our team of experienced doctors is dedicated to providing the best possible care to our patients.
                </p>
            </Container>

            <Container className="mt-5 text-center">
                <h2>Contact Us</h2>
                <p>
                    If you have any questions or need assistance, feel free to get in touch with our friendly staff.
                </p>
            </Container>
        </div>
    );
}

export default Landing;