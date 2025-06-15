const CommentSpamTracking = require("../models/CommentSpamTracking");
const crypto = require("crypto");

class CommentSpamTrackingRepository {
  /**
   * Membuat hash dari content comment
   * @param {string} content
   * @returns {string}
   */
  static createContentHash(content) {
    return crypto.createHash("md5").update(content.toLowerCase().trim()).digest("hex");
  }

  /**
   * Mencatat aktivitas comment untuk tracking spam
   * @param {number} userId
   * @param {number} postId
   * @param {string} commentContent
   * @returns {Promise<Object>}
   */
  static async trackComment(userId, postId, commentContent) {
    const contentHash = this.createContentHash(commentContent);

    return await CommentSpamTracking.query().insert({
      user_id: userId,
      post_id: postId,
      comment_content: commentContent,
      content_hash: contentHash,
    });
  }

  /**
   * Menghitung jumlah comment yang sama dari user dalam periode tertentu
   * @param {number} userId
   * @param {number} postId
   * @param {string} commentContent
   * @param {number} timeWindowMinutes
   * @returns {Promise<number>}
   */ static async countSimilarComments(userId, postId, commentContent, timeWindowMinutes = 10) {
    const contentHash = this.createContentHash(commentContent);
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - timeWindowMinutes);

    return await CommentSpamTracking.query().where("user_id", userId).where("post_id", postId).where("content_hash", contentHash).where("created_at", ">=", timeThreshold.toISOString().slice(0, 19).replace("T", " ")).resultSize();
  }

  /**
   * Mendapatkan history comment spam dari user
   * @param {number} userId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  static async getUserSpamHistory(userId, limit = 50) {
    return await CommentSpamTracking.query().where("user_id", userId).orderBy("created_at", "desc").limit(limit).withGraphFetched("[user, post]");
  }

  /**
   * Membersihkan data tracking yang sudah lama (older than X days)
   * @param {number} daysOld
   * @returns {Promise<number>}
   */ static async cleanOldTrackingData(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return await CommentSpamTracking.query().where("created_at", "<", cutoffDate.toISOString().slice(0, 19).replace("T", " ")).delete();
  }

  /**
   * Cek apakah user sedang melakukan rapid commenting
   * @param {number} userId
   * @param {number} postId
   * @param {number} timeWindowMinutes
   * @param {number} maxComments
   * @returns {Promise<boolean>}
   */ static async isRapidCommenting(userId, postId, timeWindowMinutes = 5, maxComments = 3) {
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - timeWindowMinutes);

    const count = await CommentSpamTracking.query().where("user_id", userId).where("post_id", postId).where("created_at", ">=", timeThreshold.toISOString().slice(0, 19).replace("T", " ")).resultSize();

    return count >= maxComments;
  }
}

module.exports = CommentSpamTrackingRepository;
