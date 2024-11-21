const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    imageUrl: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    price: { type: Number, required: true },
    amenities: { type: [String], default: [] },
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Hotel', hotelSchema);
