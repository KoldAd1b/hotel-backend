const express = require("express");
const {
  addUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/userController");
const authorize = require("../utils/authorize");

const router = express.Router();

router.post("/", authorize.userIsAdmin, addUser);

router.put("/:id", authorize.checkUserPermissions, updateUser);

router.delete("/:id", authorize.checkUserPermissions, deleteUser);

router.get("/", authorize.userIsAdmin, getUsers);

module.exports = router;
