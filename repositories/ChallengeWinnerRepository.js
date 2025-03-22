// Import model
const ChallengeWinner = require("../models/ChallengeWinner");

class ChallengeWinnerRepository {
  // Get challenge winner by challenge id
  static async findByChallengeId(challenge_id) {
    return await ChallengeWinner.query().where({ challenge_id });
  }

  // Create a new challenge winner
  static async create(challenge_id, user_id, rank) {
    return await ChallengeWinner.query().insert({ challenge_id, user_id, rank });
  }
}

module.exports = ChallengeWinnerRepository;
