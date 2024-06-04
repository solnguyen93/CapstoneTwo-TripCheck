const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * User routes
 */

// Route to get all users
router.get('/all', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(404).json({ message: error.message });
    }
});

// Route to get a user by their username
router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by username:', error);
        res.status(error.status || 500).json({ message: error.message });
    }
});

// Route to update user data
router.put('/:username', async (req, res) => {
    const { username } = req.params;
    const data = req.body;
    try {
        const updatedUser = await User.update(username, data);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: error.message });
    }
});

// Route to remove a user
router.delete('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        await User.remove(username);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
