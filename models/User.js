const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A user must have a username"],
      minlength: 4,
      maxlength: 55,
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      validate: {
        message: "Invalid Email,Please try again",
        validator: validator.isEmail,
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 6,
    },
    role: {
      default: "user",
      enum: ["admin", "user"],
      type: String,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (passToCompare) {
  return await bcrypt.compare(passToCompare, this.password);
};

module.exports = mongoose.model("User", userSchema);
