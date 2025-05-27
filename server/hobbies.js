const express = require('express');
const router = express.Router();
const UserHobbies = require('./models/Hobbies');

// GET all hobby names for a user
router.get('/hobbies/names', async (req, res) => {
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ message: 'userEmail query parameter is required' });
    }
    try {
        const userHobbies = await UserHobbies.findOne({ userEmail });
        if (!userHobbies || !userHobbies.hobbies) {
            return res.json([]);
        }
        const names = userHobbies.hobbies.map(hobby => hobby.name);
        res.json(names);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all inspiration images for a specific hobby and user
router.get('/hobbies/inspiration-images', async (req, res) => {
    const { userEmail, hobbyName } = req.query;
    if (!userEmail || !hobbyName) {
        return res.status(400).json({ message: 'userEmail and hobbyName query parameters are required' });
    }
    try {
        const userHobbies = await UserHobbies.findOne({ userEmail });
        if (!userHobbies || !userHobbies.hobbies) {
            return res.json([]);
        }
        const hobby = userHobbies.hobbies.find(h => h.name === hobbyName);
        if (!hobby) {
            return res.json([]);
        }
        res.json(hobby.inspirationImages || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add a new hobby for a user
router.post('/hobbies/add', async (req, res) => {
    const { userEmail, name, color, inspirationImages = [], mainImage } = req.body;
    if (!userEmail || !name || !color || !mainImage) {
        return res.status(400).json({ message: 'userEmail, name, color, and mainImage are required' });
    }
    try {
        let userHobbies = await UserHobbies.findOne({ userEmail });
        const newHobby = { name, color, inspirationImages, mainImage };

        if (!userHobbies) {
            // Create new user hobbies document
            userHobbies = new UserHobbies({
                userEmail,
                hobbies: [newHobby]
            });
        } else {
            // Prevent duplicate hobby names
            if (userHobbies.hobbies.some(hobby => hobby.name === name)) {
                return res.status(400).json({ message: 'Hobby with this name already exists.' });
            }
            userHobbies.hobbies.push(newHobby);
        }

        await userHobbies.save();
        res.status(201).json({ message: 'Hobby added successfully', hobby: newHobby });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;