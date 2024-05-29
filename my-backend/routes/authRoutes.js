const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(500).json({ error: 'User already exists' });
        }
        const user = await User.register(name, username, email, password);
        const token = jwt.sign({ user: { id: user.id, name: user.name, username: user.username, email: user.email } }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = jwt.sign({ user: { id: user.id, name: user.name, username: user.username, email: user.email } }, process.env.JWT_SECRET);

        res.json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Invalid Credentials' });
    }
});

module.exports = router;
