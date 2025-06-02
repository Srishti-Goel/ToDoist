const { v4: uuidv4 } = require('uuid');
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
        const names = userHobbies.hobbies.map(hobby => ({ name: hobby.name, mainImage: hobby.mainImage }));

        res.json(names);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all inspiration images for a specific hobby and user
router.get('/hobbies/inspiration-images', async (req, res) => {
    const { userEmail, hobbyName } = req.query;
    if (!userEmail || !hobbyName) {
        console.error('Missing query parameters:', { userEmail, hobbyName });
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
        const newHobby = { id: uuidv4(), name, color, inspirationImages, mainImage };

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

// GET all information about all hobbies for a user
router.get('/hobbies', async (req, res) => {
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ message: 'userEmail query parameter is required' });
    }
    try {
        const userHobbies = await UserHobbies.findOne({ userEmail });
        if (!userHobbies || !userHobbies.hobbies) {
            return res.json([]);
        }
        res.json(userHobbies.hobbies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update a hobby for a user
router.put('/hobbies/update', async (req, res) => {
    const { userEmail, hobbyId, name, color, inspirationImages, mainImage } = req.body;
    if (!userEmail || !name) {
        return res.status(400).json({ message: 'userEmail and name are required' });
    }
    try {
        const userHobbies = await UserHobbies.findOne({ userEmail });
        if (!userHobbies) {
            return res.status(404).json({ message: 'User hobbies not found' });
        }
        const hobby = userHobbies.hobbies.find(h => h._id.toString() === hobbyId);
        if (!hobby) {
            return res.status(404).json({ message: 'Hobby not found' });
        }
        hobby.id = hobbyId;
        if (color !== undefined) hobby.color = color;
        if (inspirationImages !== undefined) hobby.inspirationImages = inspirationImages;
        if (mainImage !== undefined) hobby.mainImage = mainImage;

        await userHobbies.save();
        res.json({ message: 'Hobby updated successfully', hobby });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add an inspiration image to a hobby for a user
router.post('/hobbies/add-image', async (req, res) => {
    const { userEmail, name, color, inspirationImages, mainImage, newImage } = req.body;
    if (!userEmail || !name) {
        console.error('Missing required fields:', { userEmail, name });
        return res.status(400).json({ message: 'userEmail and name are required' });
    }
    try {
        const userHobbies = await UserHobbies.findOne({ userEmail });
        if (!userHobbies) {
            return res.status(404).json({ message: 'User hobbies not found' });
        }
        const hobby = userHobbies.hobbies.find(h => h.name === name);
        if (!hobby) {
            return res.status(404).json({ message: 'Hobby not found' });
        }
        if (color !== undefined) hobby.color = color;
        if (inspirationImages !== undefined) hobby.inspirationImages = inspirationImages;
        if (mainImage !== undefined) hobby.mainImage = mainImage;
        hobby.inspirationImages.push(newImage);

        await userHobbies.save();
        res.json({ message: 'Hobby updated successfully', hobby });
    } catch (err) {
        console.error('Error adding image:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET to delete a hobby by ID
router.get('/hobbies/delete/:id', async (req, res) => {
    console.log("Got a delete request");
    const { id } = req.params;
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ message: 'userEmail query parameter is required' });
    }
    try {
        const userHobbies = await UserHobbies.findOne({ userEmail });
        if (!userHobbies) {
            console.error("User with hobbies not found");
            return res.status(404).json({ message: 'User hobbies not found' });
        }

        const before = userHobbies.hobbies.length;
        userHobbies.hobbies = userHobbies.hobbies.filter(hobby => hobby._id.toString() !== id);
        const after = userHobbies.hobbies.length;
        
        if (before === after) {
            return res.status(400).json({ message: 'Hobby not found' });
        }

        await userHobbies.save();
        res.json({ message: 'Hobby deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;