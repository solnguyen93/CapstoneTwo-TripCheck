import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// Component for the landing page of TripCheck
const TripCheck = () => {
    // Access user and message from the AuthContext
    const { user, msg } = useAuth();
    // Hook for navigation
    const navigate = useNavigate();
    // State variable to toggle between login and register forms
    const [showRegister, setShowRegister] = useState(false);

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
        <div>
            <h1>Welcome to TripCheck</h1>
            <div>
                {/* Display any messages from the context */}
                {msg.message && <div className={`alert alert-${msg.type}`}>{msg.message}</div>}
                <div>
                    {/* Render either the login or register form based on state */}
                    {showRegister ? (
                        <>
                            <RegisterForm />
                            <div>
                                {/* Provide link to switch to login form */}
                                Already have an account? <a onClick={handleAlreadyAccountClick}>Sign In</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <LoginForm />
                            <p>New to TripCheck?</p>
                            {/* Display button to switch to register form */}
                            {!showRegister && <button onClick={handleRegisterClick}>Register</button>}
                        </>
                    )}
                </div>
                <div>
                    {/* Information for quick access and demo */}
                    <p>Register your own account or use the credentials below for quick access and demo:</p>
                    <p>
                        <strong>Username:</strong> testuser
                        <br />
                        <strong>Password:</strong> password
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TripCheck;
