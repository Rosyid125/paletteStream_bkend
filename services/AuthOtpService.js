// Service untuk logika OTP email login
const AuthOtpRepository = require("../repositories/AuthOtpRepository");
const AuthOtpRegisterRepository = require("../repositories/AuthOtpRegisterRepository");
const UserRepository = require("../repositories/UserRepository");
const customError = require("../errors/customError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmailService = require("./EmailService"); // pastikan file ini ada dan sudah diimplementasi

const OTP_EXPIRE_SECONDS = 60; // 60 detik untuk semua OTP
const OTP_RESEND_LIMIT = 5;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatMySQLTimestamp(date) {
  // YYYY-MM-DD HH:mm:ss
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
}

class AuthOtpService {
  // OTP untuk register: simpan berdasarkan email saja (tanpa user_id)
  static async sendRegisterOtp(email) {
    // Generate OTP dan hash
    const otp = generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    // Tidak pakai expiry untuk register
    await AuthOtpRegisterRepository.createRegisterOtp({ email, otp_hash, resend_count: 0 });
    // Email tampilan khusus register
    await EmailService.sendOtpEmailRegister(email, otp);
    return { email };
  }

  // Verifikasi OTP untuk register (tanpa cek expiry)
  static async verifyRegisterOtp(email, otp) {
    const otpRecord = await AuthOtpRegisterRepository.findRegisterOtpByEmail(email);
    if (!otpRecord) throw new customError("OTP not found", 404);
    const valid = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!valid) throw new customError("OTP invalid", 400);
    await AuthOtpRegisterRepository.deleteRegisterOtpById(otpRecord.id);
    return true;
  }

  // Untuk login OTP (user sudah ada)
  static async sendOtp(email) {
    let user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    if (user.status === "banned") throw new customError("Your account is banned. Please contact support.", 403);
    const otp = generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expiry = formatMySQLTimestamp(new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000));
    await AuthOtpRepository.create({ user_id: user.id, otp_hash, expiry, resend_count: 0 });
    await EmailService.sendOtpEmail(email, otp);
    return { user };
  }

  // Verifikasi OTP login
  static async verifyLoginOtp(email, otp) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    if (user.status === "banned") throw new customError("Your account is banned. Please contact support.", 403);
    const otpRecord = await AuthOtpRepository.findByUserId(user.id);
    if (!otpRecord) throw new customError("OTP not found", 404);
    if (new Date(otpRecord.expiry) < new Date()) throw new customError("OTP expired", 400);
    const valid = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!valid) throw new customError("OTP invalid", 400);
    await AuthOtpRepository.deleteById(otpRecord.id);
    return user;
  }

  // Resend OTP untuk login
  static async resendLoginOtp(email) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    const otpRecord = await AuthOtpRepository.findByUserId(user.id);
    if (otpRecord && otpRecord.resend_count >= OTP_RESEND_LIMIT) {
      throw new customError("Resend limit reached", 429);
    }
    const otp = generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expiry = formatMySQLTimestamp(new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000));
    if (otpRecord) {
      await AuthOtpRepository.updateById(otpRecord.id, {
        otp_hash,
        expiry,
        resend_count: (otpRecord.resend_count || 0) + 1,
      });
    } else {
      await AuthOtpRepository.create({ user_id: user.id, otp_hash, expiry, resend_count: 1 });
    }
    await EmailService.sendOtpEmail(email, otp);
    return { user };
  }

  // OTP untuk forgot password: mirip register, berbasis email, tanpa expiry
  static async sendForgotPasswordOtp(email) {
    // Pastikan user ada
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    const otp = generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    await AuthOtpRegisterRepository.createRegisterOtp({ email, otp_hash, resend_count: 0 });
    await EmailService.sendOtpEmailForgotPassword(email, otp);
    return { email };
  }

  static async verifyForgotPasswordOtp(email, otp) {
    const otpRecord = await AuthOtpRegisterRepository.findRegisterOtpByEmail(email);
    if (!otpRecord) throw new customError("OTP not found", 404);
    const valid = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!valid) throw new customError("OTP invalid", 400);
    // Jangan hapus di sini, hapus saat reset password sukses
    return true;
  }

  static async resetPasswordWithOtp(email, otp, newPassword) {
    // Verifikasi OTP
    const otpRecord = await AuthOtpRegisterRepository.findRegisterOtpByEmail(email);
    if (!otpRecord) throw new customError("OTP not found", 404);
    const valid = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!valid) throw new customError("OTP invalid", 400);
    // Update password user
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePasswordById(user.id, passwordHash);
    // Hapus OTP setelah sukses
    await AuthOtpRegisterRepository.deleteRegisterOtpById(otpRecord.id);
    return true;
  }
}

module.exports = AuthOtpService;
