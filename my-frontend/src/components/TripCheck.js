import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const TripCheck = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/checklist');
        }
    }, [user, navigate]);

    const handleRegisterClick = () => {
        setShowRegister(true);
    };

    const handleAlreadyAccountClick = () => {
        setShowRegister(false);
    };

    return (
        <div>
            <h1>Welcome to TripCheck</h1>
            <div>
                <div>
                    {showRegister ? (
                        <>
                            <RegisterForm />
                            <div>
                                Already have an account? <a onClick={handleAlreadyAccountClick}>Sign In</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <LoginForm />
                            <p>New to TripCheck?</p>
                            {!showRegister && <button onClick={handleRegisterClick}>Register</button>}
                        </>
                    )}
                </div>
                <div>
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
