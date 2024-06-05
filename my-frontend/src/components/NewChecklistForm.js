import React, { useState } from 'react';
import TripCheckApi from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Box, TextField, Button, Typography } from '@mui/material';

const NewChecklistForm = () => {
    const navigate = useNavigate();
    const { msg, setMsg } = useAuth();

    // Define initial state for form inputs
    const initialState = {
        title: '',
        description: '',
        tripDestination: '',
        tripFromDate: '',
        tripToDate: '',
    };

    // Initialize state for the form data
    const [newChecklist, setNewChecklist] = useState(initialState);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if the title is empty
        if (!newChecklist.title.trim()) {
            // Display error message if title is empty
            setMsg({ message: 'Title cannot be empty', type: 'danger' });
            return;
        }
        try {
            // Call the TripCheckApi method to create a new checklist
            const res = await TripCheckApi.addChecklist(newChecklist);
            setNewChecklist(initialState);
            setMsg({ message: 'Checklist created successfully', type: 'success' });
            navigate(`/checklist/${res.newChecklist.id}/items`);
        } catch (error) {
            console.error('Adding new checklist error:', error.message);
            // Display error message if checklist creation fails
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the checklist state with the new value based on the input field's name
        setNewChecklist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Render the new checklist form
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            {/* Display alert message if present */}
            {msg.message && (
                <Typography variant="body2" sx={{ mb: 2, color: msg.type === 'danger' ? 'error.main' : 'success.main' }}>
                    {msg.message}
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField fullWidth required label="Title" name="title" value={newChecklist.title} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField
                    fullWidth
                    multiline
                    label="Description"
                    name="description"
                    value={newChecklist.description}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Trip Destination"
                    name="tripDestination"
                    value={newChecklist.tripDestination}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="date"
                    label="Trip From Date"
                    name="tripFromDate"
                    value={newChecklist.tripFromDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        placeholder: 'MM/DD/YYYY',
                    }}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="date"
                    label="Trip To Date"
                    name="tripToDate"
                    value={newChecklist.tripToDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        placeholder: 'MM/DD/YYYY',
                    }}
                    sx={{ mb: 2 }}
                />
                {/* Button to submit form */}
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                    Create Checklist
                </Button>
                {/* Button to cancel and go back */}
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </form>
        </Box>
    );
};

export default NewChecklistForm;
