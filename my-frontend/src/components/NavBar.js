import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import TripCheckApi from '../api.js';
import { v4 as uuidv4 } from 'uuid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const NavBar = () => {
    const { user, logout, checklistId, msg, setMsg } = useAuth();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null);
    const [shareUsername, setShareUsername] = useState('');

    // Function to handle opening the menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to handle closing the menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Function to handle user logout
    const handleLogOut = () => {
        setAnchorEl(null);
        logout();
        navigate('/tripcheck');
    };

    // Function to navigate to user profile editing page
    const handleProfileEdit = () => {
        setAnchorEl(null);
        navigate(`/user/${user.username}/edit`);
    };

    // Function to navigate to checklist creation page
    const handleCreateNewChecklist = () => {
        setAnchorEl(null);
        navigate('/checklist/new');
    };

    // Function to navigate to checklist editing page
    const handleChecklistEdit = () => {
        setAnchorEl(null);
        navigate(`/checklist/${checklistId}/edit`);
    };

    // Function to handle actions (share or delete) on checklist items
    const handleAction = (action) => {
        setAnchorEl(null);
        setConfirmationAction(action);
        setShowConfirmation(true);
    };

    // Function to handle confirmation of action (delete or share)
    const handleConfirmation = async () => {
        setShowConfirmation(false);
        if (confirmationAction === 'delete') {
            try {
                // Call the TripCheckApi method to delete checklist by ID
                await TripCheckApi.deleteChecklistById(checklistId);
                // Display success message
                setMsg({ message: 'Checklist deleted successfully', type: 'success' });
                // Navigate to a different route after deletion
                navigate('/checklist');
            } catch (error) {
                // Handle any errors that occur during deletion
                console.error('Error deleting checklist:', error);
            }
        } else if (confirmationAction === 'share') {
            try {
                // Call the TripCheckApi method to share checklist with another user
                await TripCheckApi.shareChecklist(checklistId, shareUsername);
                // Display success message
                setMsg({ message: 'Checklist shared successfully', type: 'success' });
            } catch (error) {
                // Handle any errors that occur during deletion
                console.error('Error sharing checklist:', error);
                setMsg({ message: error.message, type: 'danger' });
            }
        }
    };

    return (
        <nav>
            {/* Conditional rendering based on user authentication */}
            {user ? (
                <>
                    {/* Render TripCheck link */}
                    <div className="leftNav">
                        <Link to="/checklist">TripCheck</Link>
                    </div>
                    {/* Render profile and menu options */}
                    <div className="rightNav">
                        <Link to={`/user/${user.username}`}>Profile</Link>
                        {/* Render menu icon */}
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                        {/* Render menu items */}
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {/* Conditional rendering based on current page */}
                            {location.pathname === '/checklist' && [
                                <MenuItem key={uuidv4()} onClick={handleCreateNewChecklist}>
                                    New
                                </MenuItem>,
                            ]}

                            {location.pathname === `/checklist/${checklistId}/items` && [
                                <MenuItem key={uuidv4()} onClick={handleChecklistEdit}>
                                    Edit
                                </MenuItem>,
                                <MenuItem key={uuidv4()} onClick={() => handleAction('share')}>
                                    Share
                                </MenuItem>,
                                <MenuItem key={uuidv4()} onClick={() => handleAction('delete')}>
                                    Delete
                                </MenuItem>,
                            ]}
                            {/* Render logout menu item */}
                            <MenuItem key={uuidv4()} onClick={handleLogOut}>
                                Log out
                            </MenuItem>
                        </Menu>
                    </div>
                </>
            ) : (
                // Render links for unauthenticated users
                <nav>
                    {location.pathname === `/` && <Link to="/tripcheck">TripCheck</Link>}
                    {location.pathname === `/tripcheck` && <Link to="/">About Me</Link>}
                </nav>
            )}
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
                    {/* Display confirmation message based on action */}
                    <p id="confirmation-modal-description">
                        {confirmationAction === 'delete' ? 'Are you sure you want to delete this checklist?' : "Enter recipient's username:"}
                    </p>
                    {/* Render text field for entering share username */}
                    {confirmationAction === 'share' && (
                        <TextField value={shareUsername} onChange={(e) => setShareUsername(e.target.value)} label="Username" variant="outlined" />
                    )}
                    {/* Render confirmation buttons */}
                    <Button onClick={handleConfirmation}>Yes</Button>
                    <Button onClick={() => setShowConfirmation(false)}>No</Button>
                </Box>
            </Modal>
        </nav>
    );
};

export default NavBar;
