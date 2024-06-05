import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Sign In
            </Button>
            <Box mt={4} sx={{ textAlign: 'center' }}>
                {/* Information for quick access and demo */}
                <Typography variant="body2">Register your own account or use the credentials below for quick demo.</Typography>
                <Typography variant="body2">
                    <strong>Username:</strong> testuser <strong> Password:</strong> password
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;
