// Model untuk tabel auth_otp_register (OTP register by email, tanpa user_id)
const { Model } = require("objection");

class AuthOtpRegister extends Model {
  static get tableName() {
    return "auth_otp_register";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "otp_hash"], // Hapus 'expiry' dari required
      properties: {
        id: { type: "integer" },
        email: { type: "string", format: "email" },
        otp_hash: { type: "string" },
        resend_count: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = AuthOtpRegister;
