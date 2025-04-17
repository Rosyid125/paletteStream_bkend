// Import model
const ChallengeWinner = require("../models/ChallengeWinner");
// For error handling
const currentRepo = "ChallengeWinnerRepository";

class ChallengeWinnerRepository {
  // Get challenge winner by challenge id
  static async findByChallengeId(challenge_id) {
    try {
      return await ChallengeWinner.query().where({ challenge_id });
    } catch (error) {
      throw error;
    }
  }

  // Create a new challenge winner
  static async create(challenge_id, user_id, rank) {
    try {
      return await ChallengeWinner.query().insert({ challenge_id, user_id, rank });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeWinnerRepository;
