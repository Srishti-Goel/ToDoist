const mongoose = require('mongoose');

const HobbySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // You can use uuid or ObjectId as string
    name: { type: String, required: true },
    color: { type: String, required: true },
    inspirationImages: [{ type: String }], // Array of image URLs
    mainImage: {type: String, required: true} // Main image URL
});

const UserHobbiesSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    hobbies: [HobbySchema]
});

module.exports = mongoose.model('UserHobbies', UserHobbiesSchema);