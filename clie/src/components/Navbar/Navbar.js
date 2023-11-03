import React from 'react';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ backgroundColor: '' }}>
            <div className="d-flex justify-content-between py-4 px-5 align-items-center" >
                <div>
                    <h3>Mayo + </h3>
                </div>
                <div className="d-flex align-items-center">
                    <a href="#home" className="me-3">Browser</a>
                    <a href="#about">Help</a>
                    <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        Login / Sign up  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={handleClose}>Patients &nbsp;  <a href="patientLogin">Login</a>&nbsp; <a href="patientSignup">Sign up</a></MenuItem>
                        <hr />
                        <MenuItem onClick={handleClose}>Doctors  &nbsp;  <a href="doctorLogin">Login</a>&nbsp; <a href="doctorSignup">Sign up</a></MenuItem>
                    </Menu>
                </div>
            </div>

           
        </div>
    );
}

export default Navbar;