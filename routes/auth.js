const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/refresh", refresh);

module.exports = router;
