const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuthRepository = require("../repositories/AuthRepository");
const UserRepository = require("../repositories/UserRepository");
const customError = require("../errors/customError");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

class AuthService {
  static async register(userData) {
    try {
      const { email, password, firstName, lastName, otp } = userData;
      if (!otp) {
        throw new customError("OTP is required for registration", 400);
      }
      // Cari user by email, jika sudah ada dan sudah punya password, tolak
      const existingUser = await User.query().findOne({ email });
      if (existingUser && existingUser.password) {
        throw new customError("Email already registered", 409);
      }
      // Verifikasi OTP
      const AuthOtpService = require("./AuthOtpService");
      await AuthOtpService.verifyRegisterOtp(email, otp); // gunakan verifyRegisterOtp, bukan verifyOtp
      // Jika user belum ada, buat user baru (harusnya sudah ada user dummy dari OTP, update password)
      let user = await UserRepository.getUserByEmail(email);
      if (!user) {
        // Safety fallback, harusnya tidak terjadi
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await UserRepository.create(email, hashedPassword, firstName, lastName, "default");
      } else {
        // Update password, nama, role jika user dummy
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await UserRepository.updateUserAfterOtpRegister(user.id, hashedPassword, firstName, lastName);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      // Find user by email
      const user = await UserRepository.getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new customError("Invalid email or password", 401);
      }
      if (user.status === "banned") {
        throw new customError("Your account is banned. Please contact support.", 403);
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
      throw error;
    }
  }

  static async getUserData(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, ACCESS_SECRET);
      const user = await UserRepository.findById(decoded.id);
      if (!user) throw new customError("User not found.");
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(oldRefreshToken) {
    try {
      const storedToken = await AuthRepository.getRefreshToken(oldRefreshToken);
      if (!storedToken) {
        throw new customError("Invalid or expired token");
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
      throw error;
    }
  }

  static async logout(refreshToken) {
    try {
      await AuthRepository.deleteRefreshToken(refreshToken);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
