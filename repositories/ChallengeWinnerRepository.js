// Import model
const ChallengeWinner = require("../models/ChallengeWinner");
const db = require("../config/db");

class ChallengeWinnerRepository {
  // Get challenge winner by challenge id
  static async findByChallengeId(challenge_id) {
    const challengeWinners = await db("challenge_winners").where({ challenge_id });
    return challengeWinners;
  }

  // Create a new challenge winner
  static async create(challenge_id, user_id, rank) {
    const [challengeWinner] = await db("challenge_winners").insert({ challenge_id, user_id, rank }).returning("*");
    return challengeWinner;
  }
}

module.exports = ChallengeWinnerRepository;
