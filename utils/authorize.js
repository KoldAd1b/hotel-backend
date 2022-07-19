const jwt = require("jsonwebtoken");
const CustomError = require("../errors");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new CustomError.UnauthorizedError(
      "Invalid request, please try again"
    );
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err)
      throw new CustomError.UnauthorizedError(
        "Invalid token,please login again"
      );
    req.user = decoded;
    next();
  });
};

const checkUserPermissions = (req, res, next) =>
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "admin" || req.user.role === "staff") {
      return next();
    } else {
      throw new CustomError.UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }
  });

const userIsAdmin = (req, res, next) =>
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      return next();
    } else {
      throw new CustomError.UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }
  });
module.exports = {
  checkUserPermissions,
  verifyToken,
  userIsAdmin,
};
