const Token = require("../models/Token");

class AuthRepository {
  // Repo khusus auth tidak berbasis CRUD biasa jadi langung sesuai kebutuhan aplikasi, karena memang tidak punya table khusus pada database
  static async saveRefreshToken(user_id, refresh_token, expires_at) {
    // Hapus token lama jika ada (One User, One Token)
    await Token.query().delete().where("user_id", user_id);

    // Simpan refresh token baru
    return await Token.query().insert({ user_id, refresh_token, expires_at });
  }

  async getUserById(user_id) {
    return await User.query().findById(user_id).select("id", "email", "first_name", "last_name", "role", "is_active");
  }

  static async getRefreshToken(refresh_token) {
    return await Token.query().findOne({ refresh_token });
  }

  static async deleteRefreshToken(refresh_token) {
    return await Token.query().delete().where("refresh_token", refresh_token);
  }

  static async deleteTokensByUserId(user_id) {
    return await Token.query().delete().where("user_id", user_id);
  }
}

module.exports = AuthRepository;
