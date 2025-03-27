const Token = require("../models/Token");
const currentRepo = "AuthRepository";

class AuthRepository {
  static async saveRefreshToken(user_id, refresh_token, expires_at) {
    try {
      await Token.query().delete().where({ user_id });
      return await Token.query().insert({ user_id, refresh_token, expires_at });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  static async getRefreshToken(refresh_token) {
    try {
      return await Token.query().findOne({ refresh_token });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  static async deleteRefreshToken(refresh_token) {
    try {
      return await Token.query().delete().where({ refresh_token });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  static async deleteTokensByUserId(user_id) {
    try {
      return await Token.query().delete().where({ user_id });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = AuthRepository;
