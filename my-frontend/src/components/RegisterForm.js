import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, setMsg } = useAuth();
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
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Render the user registration form
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Register
            </Button>
        </Box>
    );
};

export default RegisterForm;
