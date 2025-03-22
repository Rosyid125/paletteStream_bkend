// Import model
const Challenge = require("../models/Challenge");

class ChallengeRepository {
  // Get all challenges
  static async findAll() {
    const challenges = await Challenge.query();
    return challenges;
  }

  // Get all challenges that are still available
  static async findAvailable() {
    const challenges = await Challenge.query().where("status", "open");
    return challenges;
  }

  // Get challenge by id
  static async findById(id) {
    const challenge = await Challenge.query().findOne({ id });
    return challenge;
  }

  // Create a new challenge
  static async create(title, description, images, start_date, end_date, status) {
    const challenge = await Challenge.query().insert({ title, description, images, start_date, end_date, status });
    return challenge;
  }

  // Update challenge
  static async update(id, title, description, images, start_date, end_date, status) {
    const challenge = await Challenge.query().findOne({ id });
    if (!challenge) {
      return null;
    }
    await Challenge.query().findOne({ id }).patch({ title, description, images, start_date, end_date, status });
    return challenge;
  }

  // Delete a challenge
  static async delete(id) {
    const challenge = await Challenge.query().findOne({ id });
    if (!challenge) {
      return null;
    }
    await Challenge.query().findOne({ id }).delete();
    return challenge;
  }
}

module.exports = ChallengeRepository;
