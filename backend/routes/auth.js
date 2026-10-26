const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const emailRegex = /^\S+@\S+\.\S+$/;

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, title , description , status , role } = req.body;
        if (!name || !email || !password ||title || description || status || !role) return res.status(400).json({ message: 'All fields are required' });
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
        if (!['Admin', 'User'].includes(role)) return res.status(400).json({ message: 'Role must be Admin or User' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await user.comparePassword(password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
