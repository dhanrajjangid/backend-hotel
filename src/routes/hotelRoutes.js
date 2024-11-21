const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const searchController = require("../controllers/searchController");


// Routes for hotel management
router.post("/", hotelController.addHotel);
router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.put("/:id", hotelController.editHotel);
router.delete("/:id", hotelController.removeHotel);

// AI search route
router.post('/search', searchController.searchHotels);

module.exports = router;
