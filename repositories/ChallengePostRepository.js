// Import model
const ChallengePost = require("../models/ChallengePost");

class ChallengePostRepository {
  // Get all challenge posts id by challenge id
  static async getChallengePostsByChallengeId(challenge_id) {
    return ChallengePost.query().where({ challenge_id });
  }

  // Get challenge post by post id
  static async getChallengePostByPostId(post_id) {
    return ChallengePost.query().where({ post_id }).first();
  }

  // Create challenge post
  static async createChallengePost(post_id, challenge_id) {
    return ChallengePost.query().insert({ post_id, challenge_id });
  }

  // Delete challenge post
  static async deleteChallengePost(post_id) {
    return ChallengePost.query().delete().where({ post_id });
  }
}

module.exports = ChallengePostRepository;
