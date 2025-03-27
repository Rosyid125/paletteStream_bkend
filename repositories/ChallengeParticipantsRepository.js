// Import model
const ChallengeParticipant = require("../models/ChallengeParticipant");
const currentRepo = "ChallengeParticipantsRepository";

class ChallengeParticipantsRepository {
  // Get challenge participants by challenge id
  static async findByChallengeId(challenge_id) {
    try {
      const challengeParticipants = await db("challenge_participants").where({ challenge_id });
      return challengeParticipants;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get challenge participant by user id
  static async findByUserId(user_id) {
    try {
      const challengeParticipants = await db("challenge_participants").where({ user_id });
      return challengeParticipants;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new challenge participant
  static async create(challenge_id, user_id) {
    try {
      const [challengeParticipant] = await db("challenge_participants").insert({ challenge_id, user_id }).returning("*");
      return challengeParticipant;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
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
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = ChallengeParticipantsRepository;
