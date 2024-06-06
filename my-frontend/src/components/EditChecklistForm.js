import React from 'react';
import TripCheckApi from '../api.js';
import { useNavigate, useParams } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import { useAuth } from '../AuthContext';
import { Box, TextField, Button, Typography } from '@mui/material';

const EditChecklistForm = () => {
    const { checklistId } = useParams();
    const navigate = useNavigate();
    const { msg, setMsg } = useAuth();

    // Fetch checklist data using useDataFetching custom hook
    const {
        data: checklist,
        setData: setChecklist,
        loading: checklistLoading,
    } = useDataFetching(() => {
        // Call the TripCheckApi method to get checklist data by ID
        return TripCheckApi.getChecklistById(checklistId);
    });

    const {
        data: users,
        setData: setUsers,
        loading: usersLoading,
    } = useDataFetching(() => {
        return TripCheckApi.getSharedUsers(checklistId);
    });

    // If checklist data is still loading, display a loading message
    if (checklistLoading || usersLoading) {
        return <p>Loading...</p>;
    }

    // If no checklist data is returned, display a message indicating no checklist found
    if (!checklist) {
        return <p>No checklist found.</p>;
    }

    // Handle form submission for editing checklist
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate if the checklist title is empty
        if (!checklist.title.trim()) {
            setMsg({ message: 'Title cannot be empty', type: 'danger' });
            return;
        }
        // Validate if toDate is before fromDate
        if (checklist.tripFromDate && checklist.tripToDate && new Date(checklist.tripToDate) < new Date(checklist.tripFromDate)) {
            setMsg({ message: 'Trip To Date cannot be before Trip From Date', type: 'danger' });
            return;
        }
        try {
            // Call the TripCheckApi method to edit the checklist with the updated data
            await TripCheckApi.editChecklist(checklist, checklistId);
            // Display success message upon successful editing
            setMsg({ message: 'Checklist edited successfully', type: 'success' });
            // Redirect to the checklist items page after successful editing
            navigate(`/checklist/${checklistId}/items`);
        } catch (error) {
            // Log and display error message if editing checklist fails
            console.error('Editing checklist error:', error.message);
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the checklist state with the new value based on the input field's name
        setChecklist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDeleteSharedUser = async (checklistId, userId) => {
        try {
            await TripCheckApi.deleteSharedUser(checklistId, userId);
            console.log('users1', users);
            setUsers((prevState) => prevState.filter((user) => user.id !== userId));
            console.log('users2', users);
            setMsg({ message: 'Shared user delete successfully', type: 'success' });
        } catch (error) {
            console.error('Shared user delete error:', error.message);
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Render the edit checklist form
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <form onSubmit={handleSubmit}>
                {/* Display alert message if present */}
                {msg.message && (
                    <Typography variant="body2" sx={{ mb: 2, color: msg.type === 'danger' ? 'error.main' : 'success.main' }}>
                        {msg.message}
                    </Typography>
                )}
                <TextField fullWidth required label="Title" name="title" value={checklist?.title || ''} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField
                    fullWidth
                    multiline
                    label="Description"
                    name="description"
                    value={checklist?.description || ''}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Trip Destination"
                    name="tripDestination"
                    value={checklist?.tripDestination || ''}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="date"
                    label="Trip From Date"
                    name="tripFromDate"
                    value={checklist?.tripFromDate}
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
                    value={checklist?.tripToDate}
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
                    Submit
                </Button>
                {/* Button to cancel and go back */}
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </form>
            <div>
                <Typography variant="h6" sx={{ mt: 4 }}>
                    Shared Users:
                </Typography>

                {users ? (
                    <ul>
                        {users.map((user) => (
                            <div key={user.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Button variant="contained" color="error" size="small" onClick={() => handleDeleteSharedUser(checklistId, user.id)}>
                                    X
                                </Button>
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    {user.username}
                                </Typography>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <Typography>No users</Typography>
                )}
            </div>
        </Box>
    );
};

export default EditChecklistForm;
