const express = require("express");
const router = express.Router();
const { getUsers, createUser, createAdmin } = require("../controllers/userController");

router.get("/get", getUsers);
router.post("/create", createUser);
router.post("/create/admin", createAdmin);

module.exports = router;
