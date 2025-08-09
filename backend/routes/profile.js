const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Find user by ID from the token, exclude password from the result
        const user = await User.findById(req.user).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', authMiddleware, async (req, res) => {
    const { username, preferredCurrency, profilePictureUrl } = req.body;

    // Build profile object
    const profileFields = {};
    if (username) profileFields.username = username;
    if (preferredCurrency) profileFields.preferredCurrency = preferredCurrency;
    if (profilePictureUrl) profileFields.profilePictureUrl = profilePictureUrl;

    try {
        let user = await User.findByIdAndUpdate(
            req.user,
            { $set: profileFields },
            { new: true } // Return the updated document
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;