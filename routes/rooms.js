const express = require("express");
const {
  addRoom,
  updateRoom,
  deleteRoom,
  editRoomNumber,
} = require("../controllers/roomController");
const { userIsAdmin } = require("../utils/authorize");

const router = express.Router();

router.post("/hotel/:hotelId", userIsAdmin, addRoom);

router.put("/:roomId", userIsAdmin, updateRoom);

router.delete("/hotel/:hotelId/room/:roomId", userIsAdmin, deleteRoom);

router.put("/editNumber/:roomId/:roomNumber", userIsAdmin, editRoomNumber);

module.exports = router;
