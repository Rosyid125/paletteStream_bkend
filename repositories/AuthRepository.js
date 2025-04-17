const Token = require("../models/Token");
// For error handling
const currentRepo = "AuthRepository";

class AuthRepository {
  static async saveRefreshToken(user_id, refresh_token, expires_at) {
    try {
      await Token.query().delete().where({ user_id });
      return await Token.query().insert({ user_id, refresh_token, expires_at });
    } catch (error) {
      throw error;
    }
  }

  static async getRefreshToken(refresh_token) {
    try {
      return await Token.query().findOne({ refresh_token });
    } catch (error) {
      throw error;
    }
  }

  static async deleteRefreshToken(refresh_token) {
    try {
      return await Token.query().delete().where({ refresh_token });
    } catch (error) {
      throw error;
    }
  }

  static async deleteTokensByUserId(user_id) {
    try {
      return await Token.query().delete().where({ user_id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthRepository;
