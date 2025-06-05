// Model AuthOtp untuk tabel auth_otp
const { Model } = require("objection");

class AuthOtp extends Model {
  static get tableName() {
    return "auth_otp";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "otp_hash", "expiry"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        otp_hash: { type: "string" },
        expiry: { type: "string", format: "date-time" },
        resend_count: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = AuthOtp;
