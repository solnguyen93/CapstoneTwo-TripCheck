import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { v4 as uuidv4 } from 'uuid';

const NavBar = () => {
    const { user, logout, checklistId } = useAuth();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        setAnchorEl(null);
        logout();
        navigate('/tripcheck');
    };

    const handleProfileEdit = () => {
        setAnchorEl(null);
        navigate(`/profile/${user}`);
    };

    const handleCreateNewChecklist = () => {
        setAnchorEl(null);
        navigate('/checklist/new');
    };

    const handleChecklistEdit = () => {
        setAnchorEl(null);
        navigate(`/checklist/${checklistId}/edit`);
    };

    const handleChecklistDelete = () => {
        setAnchorEl(null);
        navigate(`/checklist/${checklistId}/delete`);
    };

    const handleChecklistShare = () => {
        setAnchorEl(null);
        navigate(`/checklist/${checklistId}/share`);
    };

    return (
        <nav>
            {user ? (
                <>
                    <div className="leftNav">
                        <Link to="/checklist">TripCheck</Link>
                    </div>
                    <div className="rightNav">
                        <Link to="/profile">Profile</Link>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {/* Conditional rendering based on current page */}
                            {location.pathname === '/checklist' && [
                                <MenuItem key={uuidv4()} onClick={handleCreateNewChecklist}>
                                    New
                                </MenuItem>,
                            ]}
                            {location.pathname === '/profile' && [
                                <MenuItem key={uuidv4()} onClick={handleProfileEdit}>
                                    Edit
                                </MenuItem>,
                            ]}
                            {location.pathname === `/checklist/${checklistId}/items` && [
                                <MenuItem key={uuidv4()} onClick={handleChecklistEdit}>
                                    Edit
                                </MenuItem>,
                                <MenuItem key={uuidv4()} onClick={handleChecklistShare}>
                                    Share
                                </MenuItem>,
                                <MenuItem key={uuidv4()} onClick={handleChecklistDelete}>
                                    Delete
                                </MenuItem>,
                            ]}
                            <MenuItem key={uuidv4()} onClick={handleLogOut}>
                                Log out
                            </MenuItem>
                        </Menu>
                    </div>
                </>
            ) : (
                <nav>
                    {location.pathname === `/` && <Link to="/tripcheck">TripCheck</Link>}
                    {location.pathname === `/tripcheck` && <Link to="/">About Me</Link>}
                </nav>
            )}
        </nav>
    );
};

export default NavBar;
