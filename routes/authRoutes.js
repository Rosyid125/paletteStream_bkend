const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Rute untuk register, login, refresh token, dan logout
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

module.exports = router;
