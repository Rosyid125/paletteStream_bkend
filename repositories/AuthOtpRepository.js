// Repository untuk akses tabel auth_otp
const AuthOtp = require("../models/AuthOtp");

class AuthOtpRepository {
  async create(data) {
    return AuthOtp.query().insert(data);
  }

  async findByUserId(user_id) {
    return AuthOtp.query().where({ user_id }).orderBy("created_at", "desc").first();
  }

  async updateById(id, data) {
    return AuthOtp.query().patchAndFetchById(id, data);
  }

  async deleteById(id) {
    return AuthOtp.query().deleteById(id);
  }

  async findValidOtp(user_id, otp_hash) {
    const now = new Date().toISOString();
    return AuthOtp.query().where({ user_id, otp_hash }).where("expiry", ">", now).first();
  }
}

module.exports = new AuthOtpRepository();
