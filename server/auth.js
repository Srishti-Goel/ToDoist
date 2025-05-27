const express = require('express');
const router = express.Router();
const UserModel = require('./models/Users');
const md5 = require('md5');

// Validation function
const validate_register = (req) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return { valid: false, message: 'All fields are required' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
};

// Register route
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    // Validate the request body
    const validation = validate_register(req);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    // Hash the password before saving
    UserModel.create({ name, email, password: md5(password) })
        .then(() => res.status(201).json({ message: 'User registered successfully' }))
        .catch((error) => {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Error registering user', error });
        });
});

// Login route
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Hash the password before comparing
    UserModel.findOne({ email, password: md5(password) })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            console.log('User logged in:', user.name);
            return res.status(200).json({
                message: 'Login successful',
                name: user.name,
                email: user.email
            });
        })
        .catch((error) => {
            return res.status(500).json({ message: 'Error logging in user', error });
        });
});

module.exports = router;