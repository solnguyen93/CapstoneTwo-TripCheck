import React, { useState } from 'react';
import TripCheckApi from '../api.js';
import { useNavigate, useParams } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import { useAuth } from '../AuthContext';

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
            setUsers((prevState) => prevState.filter((user) => user.id !== userId));
            setMsg({ message: 'Shared user delete successfully', type: 'success' });
        } catch (error) {
            console.error('Shared user delete error:', error.message);
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
                    <label>Title:</label>
                    <input type="text" name="title" value={checklist?.title || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={checklist?.description || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Trip Destination:</label>
                    <input type="text" name="tripDestination" value={checklist?.tripDestination || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Trip From Date:</label>
                    <input type="date" name="tripFromDate" value={checklist?.tripFromDate || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Trip To Date:</label>
                    <input type="date" name="tripToDate" value={checklist?.tripToDate || ''} onChange={handleChange} />
                </div>
                {/* Button to submit form */}
                <button type="submit">Submit</button>
                {/* Button to cancel and go back */}
                <button type="button" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </form>
            <div>
                <h2>Shared Users:</h2>
                {users ? (
                    <ul>
                        {users.map((user) => (
                            <div key={user.id}>
                                <button type="button" onClick={() => handleDeleteSharedUser(checklistId, user.id)}>
                                    X
                                </button>
                                <li>{user.username}</li>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>no users</p>
                )}
            </div>
        </div>
    );
};

export default EditChecklistForm;
