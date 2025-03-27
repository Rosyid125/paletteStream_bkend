const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuthRepository = require("../repositories/AuthRepository");
const UserRepository = require("../repositories/UserRepository");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

// For error handling
const currentService = "AuthService";

class AuthService {
  static async register(userData) {
    try {
      const { email, password, firstName, lastName } = userData;

      const existingUser = await User.query().findOne({ email });
      if (existingUser) {
        throw new Error(`${currentService} Error: Email already registered. User with this email already exists.`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserRepository.create(email, hashedPassword, firstName, lastName, "default");

      return user;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async login(email, password) {
    try {
      // Find user by email
      const user = await UserRepository.getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error(`${currentService} Error: Invalid email or password.`);
      }

      const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });

      const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await AuthRepository.saveRefreshToken(user.id, refreshToken, expiresAt.toISOString());

      return { accessToken, refreshToken, user };
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async getUserData(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, ACCESS_SECRET);
      const user = await UserRepository.findById(decoded.id);
      if (!user) throw new Error(`${currentService} Error: User not found.`);
      return user;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async refreshToken(oldRefreshToken) {
    try {
      const storedToken = await AuthRepository.getRefreshToken(oldRefreshToken);
      if (!storedToken) {
        throw new Error(`${currentService} Error: Invalid or expired token`);
      }

      const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET);
      const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });

      const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await AuthRepository.saveRefreshToken(decoded.id, newRefreshToken, expiresAt.toISOString());

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async logout(refreshToken) {
    try {
      await AuthRepository.deleteRefreshToken(refreshToken);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

module.exports = AuthService;
