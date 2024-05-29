import React, { useState } from 'react';
import TripCheckApi from '../api.js';

const NewChecklistForm = () => {
    const [newChecklist, setNewChecklist] = useState({
        title: '',
        description: '',
        tripDestination: '',
        tripFromDate: '',
        tripToDate: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await TripCheckApi.addChecklist(newChecklist);

        setNewChecklist({
            title: '',
            description: '',
            tripDestination: '',
            tripFromDate: '',
            tripToDate: '',
        });
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
            <button type="submit">Create Checklist</button>
        </form>
    );
};

export default NewChecklistForm;
