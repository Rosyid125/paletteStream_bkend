const AuthService = require("../services/AuthService");
const UserProfileService = require("../services/UserProfileService");
const UserExpService = require("../services/UserExpService");
const logger = require("../utils/winstonLogger");

class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.register(req.body);

      // Membuat profil pengguna default
      await UserProfileService.createDefaultUserProfile(user.id);
      // Membuat userExp default
      await UserExpService.create(user.id, 0, 1);

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.details}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(400).json({ error: error.message });
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

      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.details}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(400).json({ error: error.message });
    }
  }

  static async getMe(req, res) {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await AuthService.getUserData(token);
      res.status(200).json(user);
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.details}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(401).json({ error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
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

      res.status(200).json({ message: "Token refreshed" });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.details}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(400).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Hapus cookie
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.details}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
