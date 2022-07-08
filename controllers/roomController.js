const Room = require("../models/Rooms");
const Hotel = require("../models/Hotel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const addRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;

  const newRoom = new Room(req.body);

  const savedRoom = await newRoom.save();

  const hotel = await Hotel.findByIdAndUpdate(hotelId, {
    $push: { rooms: savedRoom._id },
  });

  res.status(StatusCodes.CREATED).json({
    status: "Success",
    room: savedRoom,
  });
};

const updateRoom = async (req, res, next) => {
  const { roomId } = req.params;

  const room = await Room.findById(roomId);

  if (!room)
    throw new CustomError.NotFoundError(
      "The requested resource to update was not found"
    );

  const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", message: "Succesfully updated the room" });
};

const deleteRoom = async (req, res, next) => {
  const { roomId, hotelId } = req.params;

  const room = await Room.findById(roomId);

  if (!room)
    throw new CustomError.NotFoundError(
      "The requested resource to delete was not found"
    );

  await Room.findByIdAndDelete(roomId);

  await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } });

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "The room has been successfully deleted",
  });
};

const editRoomNumber = async (req, res, next) => {
  const action = req.query.action;

  if (!action) {
    throw new CustomError.BadRequestError(
      "Must specify an action with the values 'add' or 'delete' "
    );
  }

  const { roomId, roomNumber } = req.params;

  const room = await Room.findById(roomId);

  if (!room)
    throw new CustomError.NotFoundError(
      "The requested resource to add/delete was not found"
    );

  if (action.toString() === "add") {
    await Room.updateOne(roomId, {
      $push: { roomNumbers: { number: +roomNumber } },
    });
  } else if (action.toString() === "delete") {
    await room.update(roomId, {
      $pull: { roomNumbers: { number: +roomNumber } },
    });
  } else {
    throw new CustomError.BadRequestError(
      "Must specify an action with the values 'add' or 'delete' "
    );
  }

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: `Successfully ${
      action === "add" ? "added" : "deleted"
    } room number ${roomNumber}`,
  });
};

module.exports = {
  addRoom,
  updateRoom,
  deleteRoom,
  editRoomNumber,
};
