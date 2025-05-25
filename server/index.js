const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://srishtigoel:wvJ3KolP1mZugYJT@cluster0.h8dx7ug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });


const validate_register = (req) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return { valid: false, message: 'All fields are required' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
}

app.post("/register", (req, res) => {
    console.log(req.body);
    console.log("Registering user...");

    // Validate the request body
    const validation = validate_register(req);
    if (!validation.valid) {
        console.log("Validation failed:", validation.message);
        return res.status(400).json({ message: validation.message });
    }

    UserModel.create(req.body)
    .then((data) => {
        console.log("User data sent successfully");
        return res.status(201).json({ message: 'User registered successfully' });
    })
    .catch((error) => {
        console.error("Error registering user:", error);
        if (error.code === 11000) {
            // Duplicate key error
            console.log("Email already exists");
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Error registering user', error });
    });
});

app.post("/login", (req, res) => {
    console.log(req.body);
    console.log("Logging in user...");

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    UserModel.findOne({ email, password })
        .then((user) => {
            if (!user) {
                console.log("Invalid email or password");
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            console.log("User logged in successfully");
            // Return only name and email in the response
            return res.status(200).json({
                message: 'Login successful',
                name: user.name,
                email: user.email
            });
        })
        .catch((error) => {
            console.error("Error logging in user:", error);
            return res.status(500).json({ message: 'Error logging in user', error });
        });
});
