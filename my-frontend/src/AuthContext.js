import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Define the base URL for API requests
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('token') || null);
    const [checklistId, setChecklistId] = useState(null);
    // State to manage messages displayed to the user
    const [msg, setMsg] = useState({ message: '', type: '' });

    // Effect to clear messages after a certain period
    useEffect(() => {
        if (msg.message) {
            // Set a timer to clear the message after 3 seconds
            const timer = setTimeout(() => {
                setMsg({ message: '', type: '' });
            }, 3000);

            // Cleanup function to clear the timeout when the component unmounts or when msg changes
            return () => clearTimeout(timer);
        }
    }, [msg]);

    // Function to handle user registration
    const register = async (name, username, email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, { name, username, email, password });
            // Store the authentication token in local storage
            localStorage.setItem('token', res.data.token);
            // Set the authenticated user in the state
            setUser(res.data.user);
        } catch (error) {
            // Display error message if registration fails
            setMsg({ message: error.response.data.message, type: 'danger' });
            throw new Error(error.response.data.message);
        }
    };

    // Function to handle user login
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            // Store the authentication token in local storage
            localStorage.setItem('token', res.data.token);
            // Set the authenticated user in the state
            setUser(res.data.user);
        } catch (error) {
            // Display error message if login fails
            setMsg({ message: error.response.data.message, type: 'danger' });
            throw new Error(error.response.data.message);
        }
    };

    // Function to handle user logout
    const logout = () => {
        // Remove the authentication token from local storage
        localStorage.removeItem('token');
        // Clear the authenticated user from the state
        setUser(null);
    };

    // Provide the authentication context to child components
    return (
        <AuthContext.Provider value={{ user, register, login, logout, checklistId, setChecklistId, msg, setMsg }}>{children}</AuthContext.Provider>
    );
};

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);
