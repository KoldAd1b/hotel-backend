const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");

const addUser = async (req, res, next) => {
  const newUser = new User(req.body);

  const user = await newUser.save();

  res.status(StatusCodes.CREATED).json({ status: "Success", user });
};
const updateUser = async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user)
    throw new CustomError.NotFoundError(
      "The requested resource to update was not found"
    );

  const updateduser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", message: "Succesfully updated the user" });
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user)
    throw new CustomError.NotFoundError(
      "The requested resource to delete was not found"
    );

  await User.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "user has been successfully deleted",
  });
};

const getUsers = async (req, res, next) => {
  const users = await User.find({}).select("-password");

  res.status(StatusCodes.OK).json({
    status: "Success",
    users,
  });
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getUsers,
};
