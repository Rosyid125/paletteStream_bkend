// Import model
const UserExp = require("../models/UserExp");
const currentRepo = "UserExpRepository";

class UserExpRepository {
  // Get all user exps
  static async findAll() {
    try {
      const userExps = await UserExp.query();
      return userExps;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user exp by user id
  static async findByUserId(user_id) {
    try {
      const userExp = await UserExp.query().findOne({ user_id });
      return userExp;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new user exp
  static async create(user_id, exp, level) {
    try {
      const userExp = await UserExp.query().insert({ user_id, exp, level });
      return userExp;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update user exp
  static async update(userId, exp, level) {
    try {
      const userExp = await UserExp.query().findOne({ user_id: userId });
      if (!userExp) {
        return null;
      }
      await UserExp.query().findOne({ user_id: userId }).patch({ exp, level });
      return userExp;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = UserExpRepository;
