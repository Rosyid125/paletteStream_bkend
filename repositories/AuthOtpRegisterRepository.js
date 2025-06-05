// Repository untuk akses tabel auth_otp_register (OTP register by email)
const AuthOtpRegister = require("../models/AuthOtpRegister");

class AuthOtpRegisterRepository {
  async createRegisterOtp(data) {
    return AuthOtpRegister.query().insert(data);
  }

  async findRegisterOtpByEmail(email) {
    return AuthOtpRegister.query().where({ email }).orderBy("created_at", "desc").first();
  }

  async deleteRegisterOtpById(id) {
    return AuthOtpRegister.query().deleteById(id);
  }
}

module.exports = new AuthOtpRegisterRepository();
