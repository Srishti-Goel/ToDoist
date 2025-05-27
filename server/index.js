const express = require('express');
const bodyParser = require('body-parser');
const DbMongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./auth');
const tasksRouter = require('./tasks');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Use routers
app.use(authRouter);
app.use(tasksRouter);

DbMongoose.connect('mongodb+srv://srishtigoel:wvJ3KolP1mZugYJT@cluster0.h8dx7ug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
DbMongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
DbMongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});
DbMongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
