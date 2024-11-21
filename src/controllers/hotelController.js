const Hotel = require("../models/hotelModel");

// Add a new hotel
const addHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get hotel details by ID
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit hotel details
const editHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove a hotel
const removeHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addHotel, getHotels, getHotelById, editHotel, removeHotel };
