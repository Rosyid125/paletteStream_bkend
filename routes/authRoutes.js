const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Rute untuk register, login, refresh token, dan logout
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/login/email", AuthController.loginEmail);
router.post("/login/email/verify", AuthController.verifyEmailOtp);
router.post("/login/email/resend", AuthController.resendEmailOtp);
router.get("/me", AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.get("/login/google", AuthController.loginGoogle);
router.get("/auth/google/callback", AuthController.googleCallback);

module.exports = router;
