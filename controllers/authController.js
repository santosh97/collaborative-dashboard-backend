'use strict';
/*******
 * controllers/authController.js: controller for auth
 * 
 * 11/2024 Santosh Dubey
 *
 */
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// User Registration
exports.userRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create and save the user
        const user = new User({ email, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ _userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ user, token });
    } catch (error) {
        console.log('Registration error:', error.message);
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
};
// User Login
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};