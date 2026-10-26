const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, roleGuard } = require('../middleware/auth');


router.get('/', verifyToken, roleGuard('Admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', verifyToken, roleGuard('Admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'All fields are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', verifyToken, roleGuard('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password,role } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; 
    // if (title ) user.title = title;
    // if(description) user.description ;
    // if (status) user.status ; 
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', verifyToken, roleGuard('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
