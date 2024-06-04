import React from 'react';
import TripCheckApi from '../api.js';
import { useNavigate, useParams } from 'react-router-dom';
import useDataFetching from '../hooks/useDataFetching';
import { useAuth } from '../AuthContext';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { msg } = useAuth();

    // Fetch user data using useDataFetching custom hook
    const { data: userData, loading } = useDataFetching(() => TripCheckApi.getUserByUsername(username));

    // If user data is still loading, display a loading message
    if (loading) {
        return <p>Loading...</p>;
    }

    // Render the user profile with user data
    console.log(username);
    return (
        <div>
            {msg.message && <div className={`alert alert-${msg.type}`}>{msg.message}</div>}
            <div>
                <label>Name:</label>
                <div>{userData?.name}</div>
            </div>
            <div>
                <label>Username:</label>
                <div>{userData?.username}</div>
            </div>
            <div>
                <label>Email:</label>
                <div>{userData?.email}</div>
            </div>
            <button type="button" onClick={() => navigate(`/user/${username}/edit`)}>
                Edit
            </button>
            <button type="button" onClick={() => navigate(`/checklist`)}>
                Back
            </button>
        </div>
    );
};

export default Profile;
