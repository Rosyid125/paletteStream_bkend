// Import model
const ChallengePost = require("../models/ChallengePost");
const currentRepo = "ChallengePostRepository";

class ChallengePostRepository {
  // Get all challenge posts id by challenge id
  static async getChallengePostsByChallengeId(challenge_id) {
    try {
      return await ChallengePost.query().where({ challenge_id });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get challenge post by post id
  static async getChallengePostByPostId(post_id) {
    try {
      return await ChallengePost.query().where({ post_id }).first();
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create challenge post
  static async createChallengePost(post_id, challenge_id) {
    try {
      return await ChallengePost.query().insert({ post_id, challenge_id });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete challenge post
  static async deleteChallengePost(post_id) {
    try {
      return await ChallengePost.query().delete().where({ post_id });
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = ChallengePostRepository;
