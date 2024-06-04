import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

// Component for user registration form
const RegisterForm = () => {
    // HARD CODE USER FOR TESTING - DELETE AFTER * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    const [name, setName] = useState('sol');
    const [username, setUsername] = useState('sososol');
    const [email, setEmail] = useState('sol@gmail.com');
    const [password, setPassword] = useState('solsol');
    const { register } = useAuth();
    const navigate = useNavigate();

    // Handle form submission for user registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the register function with user registration data
            await register(name, username, email, password);
            // Redirect to the tripcheck page after successful registration
            navigate('/tripcheck');
        } catch (error) {
            // Log error message if registration fails
            console.error('Register error:', error.message);
        }
    };

    // Render the user registration form
    return (
        <form onSubmit={handleSubmit}>
            <h3>Register</h3>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
