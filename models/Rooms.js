const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "A room must have a type"],
      enum:["Single","Twin","Deluxe","Suite"],
    },
    title:{
      type:String,
      required:[true,"A room must have a title"],
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
