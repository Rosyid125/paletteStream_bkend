// Import users model
const User = require("../models/User");
// For error handling
const currentRepo = "UserRepository";

class UserRepository {
  // Get all users
  static async findAllUserIds(offset, limit) {
    try {
      const users = await User.query().select("id").offset(offset).limit(limit);

      // Array of user ids
      const userIds = users.map((user) => user.id);

      return userIds;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user by id
  static async findById(id) {
    try {
      const user = await User.query().findById(id);
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const user = await User.query().where("email", email).first();
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new user
  static async create(email, password, first_name, last_name, role) {
    try {
      const user = await User.query().insert({ email, password, first_name, last_name, role });
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update user
  static async update(id, email, password, first_name, last_name) {
    try {
      const user = await User.query().findById(id);
      if (!user) {
        return null;
      }
      await User.query().findById(id).patch({ email, password, first_name, last_name });
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const user = await User.query().findById(id);
      if (!user) {
        return null;
      }
      await User.query().deleteById(id);
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Ban user
  static async ban(id) {
    try {
      const user = await User.query().findById(id);
      if (!user) {
        return null;
      }
      await User.query().findById(id).patch({ is_active: false });
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Unban user
  static async unBan(id) {
    try {
      const user = await User.query().findById(id);
      if (!user) {
        return null;
      }
      await User.query().findById(id).patch({ is_active: true });
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new admin
  static async createAdmin(email, password, first_name, last_name) {
    try {
      const role = "admin";
      const user = await User.query().insert({ email, password, first_name, last_name, role });
      return user;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
