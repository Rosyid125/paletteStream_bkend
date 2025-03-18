const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuthRepository = require("../repositories/AuthRepository");
const UserRepository = require("../repositories/UserRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

class AuthService {
  static async register(userData) {
    const { email, password, first_name, last_name, role } = userData;

    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.create(email, hashedPassword, first_name, last_name, role);

    // Create default entries in some tables
    await UserExpRepository.create(user.id, 0, 1);
    await UserProfileRepository.create(user.id, `Player_${user.id}`, "../storage/avatar/.noimg", "Better than most people", "anywhere");

    return user;
  }

  static async login(email, password) {
    const user = await User.query().findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password.");
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    await AuthRepository.saveRefreshToken(user.id, refreshToken, expiresAt.toISOString());

    return { accessToken, refreshToken };
  }

  async getUserData(accessToken) {
    try {
      if (!accessToken) {
        throw new Error("Token not provided");
      }

      // Token verification
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      // Get user data from database
      const user = await authRepository.getUserById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static async refreshToken(oldRefreshToken) {
    const storedToken = await AuthRepository.getRefreshToken(oldRefreshToken);
    if (!storedToken) {
      throw new Error("Invalid refresh token.");
    }

    const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET);

    const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    await AuthRepository.saveRefreshToken(decoded.id, newRefreshToken, new Date().toISOString());

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken) {
    await AuthRepository.deleteRefreshToken(refreshToken);
  }
}

module.exports = AuthService;
