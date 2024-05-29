import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const TripCheck = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1> Welcome to Trip Check</h1>
            <nav>
                {user ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/checklist">Checklist</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
            <div>
                {!user && (
                    <div>
                        <p>Register your own account or use the credentials below for quick access and demo:</p>
                        <p>
                            <strong>Username:</strong> testuser
                            <br />
                            <strong>Password:</strong> password
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripCheck;
