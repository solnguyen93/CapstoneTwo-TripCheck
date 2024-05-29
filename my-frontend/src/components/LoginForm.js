import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    // HARD CODE USER FOR TESTING - DELETE AFTER * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('password');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/tripcheck');
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
