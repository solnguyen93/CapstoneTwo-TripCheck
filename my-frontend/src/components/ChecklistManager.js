import React from 'react';
import { Link } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import TripCheckApi from '../api.js';

const ChecklistManager = () => {
    const { data: checklists, loading } = useDataFetching(TripCheckApi.getChecklistsByUserId);

    return (
        <div>
            <h1>Checklist Manager</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {checklists.length === 0 ? (
                        <p>No checklists available.</p>
                    ) : (
                        <ul>
                            {checklists.map((checklist) => (
                                <li key={checklist.id}>
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
