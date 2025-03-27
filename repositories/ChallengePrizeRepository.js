// Import model
const ChallengePrize = require("../models/ChallengePrize");
// For error handling
const currentRepo = "ChallengePrizeRepository";

class ChallengePrizeRepository {
  // Get challenge prize by challenge id
  static async findByChallengeId(challenge_id) {
    try {
      const challengePrizes = await ChallengePrize.query().where({ challenge_id });
      return challengePrizes;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new challenge prize
  static async create(challenge_id, achievement_id, badge_id, exp) {
    try {
      const challengePrize = await ChallengePrize.query().insert({ challenge_id, achievement_id, badge_id, exp });
      return challengePrize;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update challenge prize
  static async update(id, challenge_id, achievement_id, badge_id, exp) {
    try {
      const challengePrize = await ChallengePrize.query().findById(id);
      if (!challengePrize) {
        return null;
      }
      await ChallengePrize.query().findById(id).patch({ challenge_id, achievement_id, badge_id, exp });
      return challengePrize;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a challenge prize
  static async delete(id) {
    try {
      const challengePrize = await ChallengePrize.query().findById(id);
      if (!challengePrize) {
        return null;
      }
      await ChallengePrize.query().deleteById(id);
      return challengePrize;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = ChallengePrizeRepository;
