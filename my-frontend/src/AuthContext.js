import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const register = async (name, username, email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, { name, username, email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        } catch (error) {
            console.error('Registration error:', error.response.data.error);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, register, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
