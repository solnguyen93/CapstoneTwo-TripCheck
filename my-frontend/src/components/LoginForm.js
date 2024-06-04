import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    // HARD CODE USER FOR TESTING - DELETE AFTER * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('password');
    const { login, setMsg } = useAuth();
    const navigate = useNavigate();

    // Handle form submission for user login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the login function with username and password
            await login(username, password);
            // Redirect to the checklist page after successful login
            navigate('/checklist');
        } catch (error) {
            // Log and display error message if login fails
            console.error('Login error:', error.message);
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Render the user login form
    return (
        <form onSubmit={handleSubmit}>
            <h3>Log In</h3>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
