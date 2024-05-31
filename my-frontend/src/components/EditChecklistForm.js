import React, { useState, useEffect } from 'react';
import TripCheckApi from '../api.js';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../helpers/formatter';

const EditChecklistForm = () => {
    const { user, checklistId } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [newChecklist, setNewChecklist] = useState({
        title: '',
        description: '',
        tripDestination: '',
        tripFromDate: '',
        tripToDate: '',
    });

    useEffect(() => {
        // Fetch the existing checklist data based on the checklistId
        const fetchChecklist = async () => {
            try {
                const res = await TripCheckApi.getChecklistById(checklistId, user.id);
                setNewChecklist(res);
            } catch (error) {
                console.error('Fetching checklist error:', error.message);
                setError(error.message);
            }
        };

        fetchChecklist();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the API to update the checklist with the new data
            await TripCheckApi.editChecklist(newChecklist, checklistId);
            // Redirect to the checklist items page after successful editing
            navigate(`/checklist/${checklistId}/items`);
        } catch (error) {
            console.error('Editing checklist error:', error.message);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the newChecklist state with the new value based on the input field's name
        setNewChecklist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={newChecklist?.title || ''} onChange={handleChange} />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={newChecklist?.description || ''} onChange={handleChange} />
            </div>
            <div>
                <label>Trip Destination:</label>
                <input type="text" name="tripDestination" value={newChecklist?.tripDestination || ''} onChange={handleChange} />
            </div>
            <div>
                <label>Trip From Date:</label>
                <input type="date" name="tripFromDate" value={formatDate(newChecklist?.tripFromDate) || ''} onChange={handleChange} />
            </div>
            <div>
                <label>Trip To Date:</label>
                <input type="date" name="tripToDate" value={formatDate(newChecklist?.tripToDate) || ''} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => navigate(`/checklist/${checklistId}/items`)}>
                Cancel
            </button>
        </form>
    );
};

export default EditChecklistForm;
