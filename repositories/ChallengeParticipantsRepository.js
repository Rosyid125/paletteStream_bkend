// Import model
const ChallengeParticipant = require("../models/ChallengeParticipant");
const db = require("../config/db");

class ChallengeParticipantsRepository {
  // Get challenge participants by challenge id
  static async findByChallengeId(challenge_id) {
    const challengeParticipants = await db("challenge_participants").where({ challenge_id });
    return challengeParticipants;
  }

  // Get challenge participant by user id
  static async findByUserId(user_id) {
    const challengeParticipants = await db("challenge_participants").where({ user_id });
    return challengeParticipants;
  }

  // Create a new challenge participant
  static async create(challenge_id, user_id) {
    const [challengeParticipant] = await db("challenge_participants").insert({ challenge_id, user_id }).returning("*");
    return challengeParticipant;
  }

  // Delete a challenge participant by user id and challenge id
  static async deleteByUserIdAndChallengeId(user_id, challenge_id) {
    const challengeParticipant = await db("challenge_participants").where({ user_id, challenge_id }).first();
    if (!challengeParticipant) {
      return null;
    }
    await db("challenge_participants").where({ user_id, challenge_id }).delete();
    return challengeParticipant;
  }
}

module.exports = ChallengeParticipantsRepository;
