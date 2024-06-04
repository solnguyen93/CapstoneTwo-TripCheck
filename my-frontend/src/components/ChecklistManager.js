import React from 'react';
import { Link } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import TripCheckApi from '../api.js';
import { useAuth } from '../AuthContext';

const ChecklistManager = () => {
    // Fetch checklists data using custom hook
    const { data: checklists, loading } = useDataFetching(TripCheckApi.getChecklistsByUserId);
    const { msg } = useAuth();

    return (
        <div>
            {/* Display alert message if present */}
            {msg.message && <div className={`alert alert-${msg.type}`}>{msg.message}</div>}
            {/* Header for the checklist manager */}
            <h1>Checklist Manager</h1>
            {/* Display loading message while fetching data */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                // Render checklists if data is available
                <div>
                    {/* Display message if no checklists are available */}
                    {checklists.length === 0 ? (
                        <p>No checklists available.</p>
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
                </div>
            )}
        </div>
    );
};

export default ChecklistManager;
