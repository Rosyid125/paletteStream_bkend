// Import model
const UserExp = require("../models/UserExp");

class UserExpRepository {
  // Get all user exps
  static async findAll() {
    const userExps = await UserExp.query();
    return userExps;
  }

  // Get user exp by user id
  static async findByUserId(user_id) {
    const userExp = await UserExp.query().findOne({ user_id });
    return userExp;
  }

  // Create a new user exp
  static async create(user_id, exp, level) {
    const userExp = await UserExp.query().insert({ user_id, exp, level });
    return userExp;
  }

  // Update user exp
  static async update(userId, exp, level) {
    const userExp = await UserExp.query().findOne({ user_id });
    if (!userExp) {
      return null;
    }
    await UserExp.query().findOne({ userId }).patch({ exp, level });
    return userExp;
  }
}

module.exports = UserExpRepository;
