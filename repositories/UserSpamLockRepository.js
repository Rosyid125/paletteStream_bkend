const UserSpamLock = require("../models/UserSpamLock");

class UserSpamLockRepository {
  /**
   * Cek apakah user sedang dalam status lock untuk spam type tertentu
   * @param {number} userId
   * @param {string} spamType
   * @returns {Promise<boolean>}
   */ static async isUserLocked(userId, spamType) {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const lock = await UserSpamLock.query().where("user_id", userId).where("spam_type", spamType).where("is_active", true).where("unlock_at", ">", now).first();

    return !!lock;
  }

  /**
   * Mendapatkan detail lock user
   * @param {number} userId
   * @param {string} spamType
   * @returns {Promise<Object|null>}
   */ static async getUserLock(userId, spamType) {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    return await UserSpamLock.query().where("user_id", userId).where("spam_type", spamType).where("is_active", true).where("unlock_at", ">", now).first();
  }

  /**
   * Membuat lock baru untuk user
   * @param {number} userId
   * @param {string} spamType
   * @param {Object} spamData
   * @param {number} lockDurationHours
   * @returns {Promise<Object>}
   */ static async createLock(userId, spamType, spamData, lockDurationHours = 24) {
    const unlockAt = new Date();
    unlockAt.setHours(unlockAt.getHours() + lockDurationHours);

    return await UserSpamLock.query().insert({
      user_id: userId,
      spam_type: spamType,
      spam_data: spamData,
      unlock_at: unlockAt.toISOString().slice(0, 19).replace("T", " "),
      is_active: true,
    });
  }

  /**
   * Menonaktifkan lock yang sudah expired
   * @returns {Promise<number>}
   */ static async deactivateExpiredLocks() {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    return await UserSpamLock.query().where("is_active", true).where("unlock_at", "<=", now).patch({ is_active: false });
  }

  /**
   * Mendapatkan semua user yang sedang di-lock
   * @param {string} spamType
   * @returns {Promise<Array>}
   */ static async getActiveLocks(spamType = null) {
    const query = UserSpamLock.query().where("is_active", true).where("unlock_at", ">", new Date().toISOString().slice(0, 19).replace("T", " ")).withGraphFetched("user");

    if (spamType) {
      query.where("spam_type", spamType);
    }

    return await query;
  }
}

module.exports = UserSpamLockRepository;
