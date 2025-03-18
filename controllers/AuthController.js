const AuthService = require("../services/AuthService");

class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      res.json(tokens);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getMe(req, res) {
    try {
      // Ambil token dari header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      // Ambil data user
      const user = await authService.getUserData(token);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
