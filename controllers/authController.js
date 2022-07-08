const User = require("../models/User");
const CustomError = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { StatusCodes } = require("http-status-codes");
const createUserPayload = require("../utils/createPayload");

const ACCESS_EXPIRES = 15 * 60;
const REFRESH_EXPIRES = 7 * 24 * 60 * 60 * 1000;

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    throw new CustomError.BadRequestError("Please provide all the details");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await User.create({
    username,
    email,
    password: hash,
  });

  const payload = createUserPayload(user);

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;

  await user.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_EXPIRES,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  }); //7 days for the refresh token
  res.status(StatusCodes.CREATED).json({
    status: "Success",
    message: "Thank you for signing up!",
    user: payload,
    accessToken,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) throw CustomError.NotFoundError("No user found with that email");

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword)
    throw new CustomError.BadRequestError("Wrong email or password");

  const payload = createUserPayload(user);

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;

  await user.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_EXPIRES,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  }); //7 days for the refresh token

  res.status(StatusCodes.OK).json({
    user: payload,
    status: "Success",
    accessToken,
  });
};

// Refresh Route Handler

const refresh = async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) throw new CustomError.UnauthorizedError("Unauthorized");

  const refreshToken = cookie.jwt;

  const user = await User.findOne({ refreshToken });

  if (!user)
    throw new CustomError.UnauthorizedError(
      "You are not authenticated. Please login"
    );

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) {
      if (!user)
        throw new CustomError.UnauthorizedError(
          "You are not authenticated. Please login"
        );
    }
    const accessToken = jwt.sign(
      createUserPayload(user),
      process.env.JWT_SECRET_KEY,
      { expiresIn: ACCESS_EXPIRES }
    );

    res.json({ accessToken });
  });
};

const logout = async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt)
    return res
      .status(204)
      .json({ status: "Success", message: "Succesfully logged out" });

  const refreshToken = cookie.jwt;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: REFRESH_EXPIRES,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
  }

  user.refreshToken = "";
  const result = await user.save();
  // Make secure true  in production

  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: REFRESH_EXPIRES,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.status(204).json({
    status: "Success",
    message: "Succesfully logged out",
  });
};

module.exports = { register, login, refresh, logout };
