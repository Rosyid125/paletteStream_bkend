const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Rute untuk register, login, refresh token, dan logout
router.post("/register", AuthController.register);
router.post("/register/otp", AuthController.registerRequestOtp);
router.post("/login", AuthController.login);
router.post("/login/email", AuthController.loginEmail);
router.post("/login/email/verify", AuthController.verifyEmailOtp);
router.post("/login/email/resend", AuthController.resendEmailOtp);
router.get("/me", AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/ws/refresh-token-and-get", AuthController.refreshTokenAndGet);
router.post("/logout", AuthController.logout);
router.get("/login/google", AuthController.loginGoogle);
router.get("/google/callback", AuthController.googleCallback);

// Forgot password
router.post("/forgot-password", AuthController.forgotPasswordRequestOtp);
router.post("/forgot-password/verify", AuthController.forgotPasswordVerifyOtp);
router.post("/forgot-password/reset", AuthController.forgotPasswordReset);

module.exports = router;
