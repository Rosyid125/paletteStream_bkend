// Service untuk logika OTP email login
const AuthOtpRepository = require("../repositories/AuthOtpRepository");
const UserRepository = require("../repositories/UserRepository");
const customError = require("../errors/customError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const OTP_EXPIRE_SECONDS = 30;
const OTP_RESEND_LIMIT = 5;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class AuthOtpService {
  static async sendOtp(email) {
    // Cari user, jika belum ada, buat user baru (tanpa password)
    let user = await UserRepository.getUserByEmail(email);
    if (!user) {
      user = await UserRepository.create(email, null, "", "", "default");
    }
    // Generate OTP dan hash
    const otp = generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000).toISOString();
    // Simpan OTP baru, reset resend_count
    await AuthOtpRepository.create({ user_id: user.id, otp_hash, expiry, resend_count: 0 });
    // Kirim OTP ke email (implementasi email di service lain)
    return { user, otp }; // otp dikembalikan untuk testing/dev, di production jangan return otp
  }

  static async verifyOtp(email, otp) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    const otpRecord = await AuthOtpRepository.findByUserId(user.id);
    if (!otpRecord) throw new customError("OTP not found", 404);
    if (new Date(otpRecord.expiry) < new Date()) throw new customError("OTP expired", 400);
    const valid = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!valid) throw new customError("OTP invalid", 400);
    // Hapus OTP setelah sukses
    await AuthOtpRepository.deleteById(otpRecord.id);
    // Generate JWT
    const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return { accessToken, user };
  }

  static async resendOtp(email) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new customError("User not found", 404);
    const otpRecord = await AuthOtpRepository.findByUserId(user.id);
    if (otpRecord && otpRecord.resend_count >= OTP_RESEND_LIMIT) {
      throw new customError("Resend limit reached", 429);
    }
    // Generate OTP baru
    const otp = generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000).toISOString();
    // Update OTP dan resend_count
    if (otpRecord) {
      await AuthOtpRepository.updateById(otpRecord.id, { otp_hash, expiry, resend_count: (otpRecord.resend_count || 0) + 1 });
    } else {
      await AuthOtpRepository.create({ user_id: user.id, otp_hash, expiry, resend_count: 1 });
    }
    // Kirim OTP ke email (implementasi email di service lain)
    return { user, otp };
  }
}

module.exports = AuthOtpService;
