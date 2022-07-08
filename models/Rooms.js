const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A room must have a title"],
      minlength: 4,
      maxlength: 55,
    },
    price: {
      type: Number,
      required: [true, "A room must have a price"],
    },
    desc: { type: String, required: [true, "A room must have a description"] },
    maxPeople: {
      type: Number,
      required: [true, "A room must have a person limit"],
    },
    roomNumbers: [
      { number: { type: Number, unique: true }, bookedDates: { type: [Date] } },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rooms", roomSchema);
