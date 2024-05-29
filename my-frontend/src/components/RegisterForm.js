import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    // HARD CODE USER FOR TESTING - DELETE AFTER * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    const [name, setName] = useState('sol');
    const [username, setUsername] = useState('sososol');
    const [email, setEmail] = useState('sol@gmail.com');
    const [password, setPassword] = useState('solsol');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, username, email, password);
            navigate('/tripcheck');
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
