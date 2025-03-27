// Import model
const Challenge = require("../models/Challenge");
// For error handling
const currentRepo = "ChallengeRepository";

class ChallengeRepository {
  // Get all challenges
  static async findAll() {
    try {
      const challenges = await Challenge.query();
      return challenges;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get all challenges that are still available
  static async findAvailable() {
    try {
      const challenges = await Challenge.query().where("status", "open");
      return challenges;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get challenge by id
  static async findById(id) {
    try {
      const challenge = await Challenge.query().findOne({ id });
      return challenge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new challenge
  static async create(title, description, images, start_date, end_date, status) {
    try {
      const challenge = await Challenge.query().insert({ title, description, images, start_date, end_date, status });
      return challenge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update challenge
  static async update(id, title, description, images, start_date, end_date, status) {
    try {
      const challenge = await Challenge.query().findOne({ id });
      if (!challenge) {
        return null;
      }
      await Challenge.query().findOne({ id }).patch({ title, description, images, start_date, end_date, status });
      return challenge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a challenge
  static async delete(id) {
    try {
      const challenge = await Challenge.query().findOne({ id });
      if (!challenge) {
        return null;
      }
      await Challenge.query().findOne({ id }).delete();
      return challenge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = ChallengeRepository;
