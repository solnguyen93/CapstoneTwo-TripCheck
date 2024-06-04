import React, { useState } from 'react';
import TripCheckApi from '../api.js';
import { useNavigate, useParams } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import { useAuth } from '../AuthContext';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const EditUserForm = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { msg, setMsg, logout } = useAuth();
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Fetch checklist data using useDataFetching custom hook
    const {
        data: userData,
        setData: setUserData,
        loading,
    } = useDataFetching(() => {
        // Call the TripCheckApi method to get checklist data by ID
        return TripCheckApi.getUserByUsername(username);
    });

    // If user data is still loading, display a loading message
    if (loading) {
        return <p>Loading...</p>;
    }

    // Handle form submission for editing user data
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate if the checklist name is empty
        if (!userData.username.trim()) {
            setMsg({ message: 'Title cannot be empty', type: 'danger' });
            return;
        }
        try {
            // Call the TripCheckApi method to edit the checklist with the updated data
            await TripCheckApi.updateUser(username, userData);
            // Display success message upon successful editing
            setMsg({ message: 'User edited successfully', type: 'success' });
            // Redirect to the checklist items page after successful editing
            navigate(`/user/${username}`);
        } catch (error) {
            // Log and display error message if editing checklist fails
            console.error('Editing user error:', error.message);
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the userData state with the new value based on the input field's name
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to handle user deletion
    const handleDeleteUser = async (e) => {
        setShowConfirmation(false);
        try {
            // Call the TripCheckApi method to delete the user
            await TripCheckApi.deleteUser(username);
            // Redirect to the home page or any appropriate page after deletion
            navigate('/');
            logout();
            // Display success message upon successful deletion
            setMsg({ message: 'User deleted successfully', type: 'success' });
        } catch (error) {
            // Log and display error message if deletion fails
            console.error('Error deleting user:', error.message);
            setMsg({ message: error.message, type: 'danger' });
        }
    };

    // Render the edit checklist form
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Display alert message if present */}
                {msg.message && <div className={`alert alert-${msg.type}`}>{msg.message}</div>}
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={userData?.name || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" name="email" value={userData?.email || ''} onChange={handleChange} />
                </div>
                {/* Button to submit form */}
                <button type="submit">Submit</button>
                {/* Button to cancel and go back */}
                <button type="button" onClick={() => navigate(-1)}>
                    Cancel
                </button>
                {/* Button to delete user */}
                <button type="button" onClick={() => setShowConfirmation(true)}>
                    Delete
                </button>
            </form>
            {/* Modal for confirmation dialog */}
            <Modal
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                    }}
                >
                    {/* Display confirmation message */}
                    <p id="confirmation-modal-description">Are you sure you want to permanently delete this user?</p>
                    {/* Render confirmation buttons */}
                    <Button onClick={handleDeleteUser}>Yes</Button>
                    <Button onClick={() => setShowConfirmation(false)}>No</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default EditUserForm;
