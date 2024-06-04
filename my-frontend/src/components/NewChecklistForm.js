import React, { useState } from 'react';
import TripCheckApi from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

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
        <form onSubmit={handleSubmit}>
            {/* Display alert message if present */}
            {msg.message && <div className={`alert alert-${msg.type}`}>{msg.message}</div>}
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={newChecklist.title} onChange={handleChange} />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={newChecklist.description} onChange={handleChange} />
            </div>
            <div>
                <label>Trip Destination:</label>
                <input type="text" name="tripDestination" value={newChecklist.tripDestination} onChange={handleChange} />
            </div>
            <div>
                <label>Trip From Date:</label>
                <input type="date" name="tripFromDate" value={newChecklist.tripFromDate} onChange={handleChange} />
            </div>
            <div>
                <label>Trip To Date:</label>
                <input type="date" name="tripToDate" value={newChecklist.tripToDate} onChange={handleChange} />
            </div>
            {/* Button to submit form */}
            <button type="submit">Create Checklist</button>
            {/* Button to cancel and go back */}
            <button type="button" onClick={() => navigate(-1)}>
                Cancel
            </button>
        </form>
    );
};

export default NewChecklistForm;
