import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NavBar = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            {user ? (
                <>
                    <Link to="/tripcheck">Trip Check</Link>
                    <Link to="/" onClick={logout}>
                        logout
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/">Home</Link>
                    <Link to="/tripcheck">Trip Check</Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;
