import React from 'react';
import TripCheckApi from '../api.js';
import { useNavigate, useParams } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import { useAuth } from '../AuthContext';
import { Box, Typography, Button } from '@mui/material';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { msg } = useAuth();

    // Fetch user data using useDataFetching custom hook
    const { data: userData, loading } = useDataFetching(() => TripCheckApi.getUserByUsername(username));

    // If user data is still loading, display a loading message
    if (loading) {
        return <p>Loading...</p>;
    }

    // Render the user profile with user data
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            {msg.message && (
                <Typography variant="body2" sx={{ mb: 2, color: msg.type === 'danger' ? 'error.main' : 'success.main' }}>
                    {msg.message}
                </Typography>
            )}

            <div>
                <Typography variant="body1">
                    <strong>Name:</strong> {userData?.name}
                </Typography>
            </div>
            <div>
                <Typography variant="body1">
                    <strong>Username:</strong> {userData?.username}
                </Typography>
            </div>
            <div>
                <Typography variant="body1">
                    <strong>Email:</strong> {userData?.email}
                </Typography>
            </div>
            <Button variant="contained" color="primary" onClick={() => navigate(`/user/${username}/edit`)} sx={{ mr: 2 }}>
                Edit
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/checklist`)}>
                Back
            </Button>
        </Box>
    );
};

export default Profile;
