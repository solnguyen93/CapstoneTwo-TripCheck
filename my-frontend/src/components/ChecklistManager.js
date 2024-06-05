import React from 'react';
import { Link } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import TripCheckApi from '../api.js';
import { useAuth } from '../AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';

const ChecklistManager = () => {
    // Fetch checklists data using custom hook
    const { data: checklists, loading } = useDataFetching(TripCheckApi.getChecklistsByUserId);
    const { msg } = useAuth();

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            {/* Display alert message if present */}
            {msg.message && (
                <Typography variant="body2" sx={{ mb: 2, color: `#${msg.type === 'danger' ? 'f44336' : '4caf50'}` }}>
                    {msg.message}
                </Typography>
            )}
            {/* Header for the checklist manager */}
            <Typography variant="h4" sx={{ mb: 2 }}>
                Checklist Manager
            </Typography>
            {/* Display loading message while fetching data */}
            {loading ? (
                <CircularProgress />
            ) : (
                // Render checklists if data is available
                <Box>
                    {/* Display message if no checklists are available */}
                    {checklists.length === 0 ? (
                        <Typography>No checklists available.</Typography>
                    ) : (
                        // Render checklist items as a list of links
                        <ul>
                            {checklists.map((checklist) => (
                                <li key={checklist.id}>
                                    {/* Link to checklist items page */}
                                    <Link to={`/checklist/${checklist.id}/items`}>{checklist.title}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ChecklistManager;
