const mongoose = require('mongoose');

const TaskItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // You can use uuid or ObjectId as string
    title: { type: String, required: true },
    description: { type: String, required: true },
    hobby: { type: String, required: true, default: "Work" }, // Added default value
}, { _id: false });

const UserTasksSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    ToDoTasks: [TaskItemSchema],
    InProgressTasks: [TaskItemSchema],
    DoneTasks: [TaskItemSchema]
});

module.exports = mongoose.model('Task', UserTasksSchema);
// This code defines a Mongoose schema and model for a User in a MongoDB database.