const express = require("express");
const {
  addHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  countHotelsByCity,
  countHotelsByType,
  getHotelById,
} = require("../controllers/hotelController");
const { userIsAdmin, verifyToken } = require("../utils/authorize");

const router = express.Router();

router.post("/", userIsAdmin, addHotel);

router.get("/countByCity", countHotelsByCity);

router.get("/countByType", countHotelsByType);

router.get("/:id", getHotelById);

router.put("/:id", userIsAdmin, updateHotel);

router.delete("/:id", userIsAdmin, deleteHotel);

router.get("/", verifyToken, getHotels);

module.exports = router;
