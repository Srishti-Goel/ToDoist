const express = require('express');
const router = express.Router();
const UserTasks = require('./models/Tasks'); // Update to your new schema file
const { v4: uuidv4 } = require('uuid');

// Get all tasks for a specific user by email
router.get('/tasks', async (req, res) => {
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ message: 'userEmail query parameter is required' });
    }
    try {
        const userTasks = await UserTasks.findOne({ userEmail });
        if (!userTasks) {
            // Return empty arrays if user not found
            return res.json({
                ToDoTasks: [],
                InProgressTasks: [],
                DoneTasks: []
            });
        }
        res.json(userTasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new task in the appropriate status array
router.post('/tasks', async (req, res) => {
    const { title, description, status, userEmail } = req.body;
    if (!title || !description || !status || !userEmail) {
        return res.status(400).json({ message: 'Title, description, status, and userEmail are required' });
    }
    const task = { id: uuidv4(), title, description };
    try {
        let userTasks = await UserTasks.findOne({ userEmail });
        if (!userTasks) {
            // Create new user document if not exists
            userTasks = new UserTasks({
                userEmail,
                ToDoTasks: [],
                InProgressTasks: [],
                DoneTasks: []
            });
        }
        if (status === "TODO") userTasks.ToDoTasks.push(task);
        else if (status === "IN_PROGRESS") userTasks.InProgressTasks.push(task);
        else if (status === "DONE") userTasks.DoneTasks.push(task);
        else return res.status(400).json({ message: 'Invalid status' });

        await userTasks.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a task by ID and status
router.post('/updatetask/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, userEmail } = req.body;
    if (!title || !description || !status || !userEmail) {
        return res.status(400).json({ message: 'Title, description, status, and userEmail are required' });
    }
    try {
        const userTasks = await UserTasks.findOne({ userEmail });
        if (!userTasks) return res.status(404).json({ message: 'User not found' });

        // Remove task from all arrays
        userTasks.ToDoTasks = userTasks.ToDoTasks.filter(task => task.id !== id);
        userTasks.InProgressTasks = userTasks.InProgressTasks.filter(task => task.id !== id);
        userTasks.DoneTasks = userTasks.DoneTasks.filter(task => task.id !== id);

        // Add updated task to the correct array
        const updatedTask = { id, title, description };
        if (status === "TODO") userTasks.ToDoTasks.push(updatedTask);
        else if (status === "IN_PROGRESS") userTasks.InProgressTasks.push(updatedTask);
        else if (status === "DONE") userTasks.DoneTasks.push(updatedTask);
        else return res.status(400).json({ message: 'Invalid status' });

        await userTasks.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task by ID
router.get('/deletetask/:id', async (req, res) => {
    const { id } = req.params;
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ message: 'userEmail query parameter is required' });
    }
    try {
        const userTasks = await UserTasks.findOne({ userEmail });
        if (!userTasks) return res.status(404).json({ message: 'User not found' });

        // Remove task from all arrays
        const before = userTasks.ToDoTasks.length + userTasks.InProgressTasks.length + userTasks.DoneTasks.length;
        userTasks.ToDoTasks = userTasks.ToDoTasks.filter(task => task.id !== id);
        userTasks.InProgressTasks = userTasks.InProgressTasks.filter(task => task.id !== id);
        userTasks.DoneTasks = userTasks.DoneTasks.filter(task => task.id !== id);
        const after = userTasks.ToDoTasks.length + userTasks.InProgressTasks.length + userTasks.DoneTasks.length;

        if (before === after) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await userTasks.save();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;