// Import model
const ChallengeParticipant = require("../models/ChallengeParticipant");
// For error handling
const currentRepo = "ChallengeParticipantsRepository";

class ChallengeParticipantsRepository {
  // Get challenge participants by challenge id
  static async findByChallengeId(challenge_id) {
    try {
      const challengeParticipants = await db("challenge_participants").where({ challenge_id });
      return challengeParticipants;
    } catch (error) {
      throw error;
    }
  }

  // Get challenge participant by user id
  static async findByUserId(user_id) {
    try {
      const challengeParticipants = await db("challenge_participants").where({ user_id });
      return challengeParticipants;
    } catch (error) {
      throw error;
    }
  }

  // Create a new challenge participant
  static async create(challenge_id, user_id) {
    try {
      const [challengeParticipant] = await db("challenge_participants").insert({ challenge_id, user_id }).returning("*");
      return challengeParticipant;
    } catch (error) {
      throw error;
    }
  }

  // Delete a challenge participant by user id and challenge id
  static async deleteByUserIdAndChallengeId(user_id, challenge_id) {
    try {
      const challengeParticipant = await db("challenge_participants").where({ user_id, challenge_id }).first();
      if (!challengeParticipant) {
        return null;
      }
      await db("challenge_participants").where({ user_id, challenge_id }).delete();
      return challengeParticipant;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeParticipantsRepository;
