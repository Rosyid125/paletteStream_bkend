const AuthService = require("../services/AuthService");
const UserProfileService = require("../services/UserProfileService");
const UserExpService = require("../services/UserExpService");
const AuthOtpService = require("../services/AuthOtpService");
const AuthGoogleService = require("../services/AuthGoogleService");
const logger = require("../utils/winstonLogger");
const customError = require("../errors/customError");

class AuthController {
  static async register(req, res) {
    try {
      // Register dengan OTP wajib
      const user = await AuthService.register(req.body);
      await UserProfileService.createDefaultUserProfile(user.id);
      await UserExpService.create(user.id, 0, 1);
      res.json({ success: true, message: "User registered successfully", data: user });
    } catch (error) {
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      if (error instanceof customError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }

  // Endpoint untuk request OTP register
  static async registerRequestOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email is required" });
      // Kirim OTP register (tanpa user dummy)
      await AuthOtpService.sendRegisterOtp(email);
      res.json({ success: true, message: "OTP sent to email", data: { email } });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack, timestamp: new Date().toISOString() });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await AuthService.login(email, password);

      // Simpan token dalam HTTP-only cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Aktifkan secure di produksi
        sameSite: "Strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.json({ success: true, message: "Login successful", data: user });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }

  static async getMe(req, res) {
    try {
      // Ambil token dari cookie
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Panggil AuthService untuk mendapatkan data pengguna
      const user = await AuthService.getUserData(token);
      res.json({ success: true, data: user });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  static async refreshToken(req, res) {
    try {
      // Ambil refresh token dari cookie
      const oldRefreshToken = req.cookies.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { accessToken, refreshToken } = await AuthService.refreshToken(oldRefreshToken);

      // Perbarui cookie dengan token baru
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.json({ success: true, message: "Token refreshed successfully" });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  static async logout(req, res) {
    try {
      // Ambil refresh token dari cookie
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Hapus cookie
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  static async loginEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email is required" });
      const { user } = await AuthOtpService.sendOtp(email);
      res.json({ success: true, message: "OTP sent to email", data: { email: user.email } });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack, timestamp: new Date().toISOString() });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async verifyEmailOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });
      // Gunakan verifyLoginOtp untuk login OTP
      const user = await AuthOtpService.verifyLoginOtp(email, otp);
      // Generate JWT
      const jwt = require("jsonwebtoken");
      const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
      const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
      const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.json({ success: true, message: "Login successful", data: user });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack, timestamp: new Date().toISOString() });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async resendEmailOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email is required" });
      await AuthOtpService.resendLoginOtp(email);
      res.json({ success: true, message: "OTP resent to email" });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack, timestamp: new Date().toISOString() });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async loginGoogle(req, res) {
    try {
      const url = AuthGoogleService.getAuthUrl();
      res.redirect(url);
    } catch (error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack, timestamp: new Date().toISOString() });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async googleCallback(req, res) {
    try {
      const { code } = req.query;
      if (!code) return res.status(400).json({ success: false, message: "Missing code" });
      const { accessToken, user } = await AuthGoogleService.handleCallback(code);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      // Bisa redirect ke FE atau return JSON
      res.json({ success: true, message: "Login successful", data: user });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack, timestamp: new Date().toISOString() });
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = AuthController;
