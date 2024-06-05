import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Container, Typography, Button, Box, Alert, Link as MuiLink, Paper } from '@mui/material';
import '../styles/TripCheck.css'; // Import custom CSS

// Component for the landing page of TripCheck
const TripCheck = () => {
    const { user, msg } = useAuth(); // Access user and message from the AuthContext
    const navigate = useNavigate(); // Hook for navigation
    const [showRegister, setShowRegister] = useState(false); // State variable to toggle between login and register forms

    // Redirect to checklist page if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/checklist');
        }
    }, [user, navigate]);

    // Handler for clicking the register button
    const handleRegisterClick = () => {
        setShowRegister(true);
    };

    // Handler for clicking the "Already have an account" link
    const handleAlreadyAccountClick = () => {
        setShowRegister(false);
    };

    // Render the TripCheck landing page
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} className="paper">
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to TripCheck
                </Typography>
                {/* Display any messages from the context */}
                {msg.message && (
                    <Alert severity={msg.type} className="alert">
                        {msg.message}
                    </Alert>
                )}
                <Box mt={2}>
                    {/* Render either the login or register form based on state */}
                    {showRegister ? (
                        <>
                            <RegisterForm />
                            <Box mt={2}>
                                {/* Provide link to switch to login form */}
                                Already have an account?{' '}
                                <MuiLink component="button" variant="body2" onClick={handleAlreadyAccountClick}>
                                    Sign In
                                </MuiLink>
                            </Box>
                        </>
                    ) : (
                        <>
                            <LoginForm />
                            <Box mt={2}>
                                <Typography variant="body1">New to TripCheck?</Typography>
                                {/* Display button to switch to register form */}
                                <Button variant="contained" color="primary" onClick={handleRegisterClick} className="register-button">
                                    Register
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default TripCheck;
