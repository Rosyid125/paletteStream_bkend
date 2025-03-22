// Import model
const ChallengePrize = require("../models/ChallengePrize");

class ChallengePrizeRepository {
  // Get challenge prize by challenge id
  static async findByChallengeId(challenge_id) {
    const challengePrizes = await ChallengePrize.query().where({ challenge_id });
    return challengePrizes;
  }

  // Create a new challenge prize
  static async create(challenge_id, achievement_id, badge_id, exp) {
    const challengePrize = await ChallengePrize.query().insert({ challenge_id, achievement_id, badge_id, exp });
    return challengePrize;
  }

  // Update challenge prize
  static async update(id, challenge_id, achievement_id, badge_id, exp) {
    const challengePrize = await ChallengePrize.query().findById(id);
    if (!challengePrize) {
      return null;
    }
    await ChallengePrize.query().findById(id).patch({ challenge_id, achievement_id, badge_id, exp });
    return challengePrize;
  }

  // Delete a challenge prize
  static async delete(id) {
    const challengePrize = await ChallengePrize.query().findById(id);
    if (!challengePrize) {
      return null;
    }
    await ChallengePrize.query().deleteById(id);
    return challengePrize;
  }
}

module.exports = ChallengePrizeRepository;
