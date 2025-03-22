// Import users model
const User = require("../models/User");

class UserRepository {
  // Get all users
  static async findAll() {
    const users = await User.query();
    return users;
  }

  // Get user by id
  static async findById(id) {
    const user = await User.query().findById(id);
    return user;
  }

  // Get user by email
  static async getUserByEmail(email) {
    const user = await User.query().where("email", email).first();
    return user;
  }

  // Create a new user
  static async create(email, password, first_name, last_name, role) {
    const user = await User.query().insert({ email, password, first_name, last_name, role });
    return user;
  }

  // Update user
  static async update(id, email, password, first_name, last_name) {
    const user = await User.query().findById(id);
    if (!user) {
      return null;
    }
    await User.query().findById(id).patch({ email, password, first_name, last_name });
    return user;
  }

  // Delete user
  static async delete(id) {
    const user = await User.query().findById(id);
    if (!user) {
      return null;
    }
    await User.query().deleteById(id);
    return user;
  }

  // Ban user
  static async ban(id) {
    const user = await User.query().findById(id);
    if (!user) {
      return null;
    }
    await User.query().findById(id).patch({ is_active: false });
    return user;
  }

  // Unban user
  static async unBan(id) {
    const user = await User.query().findById(id);
    if (!user) {
      return null;
    }
    await User.query().findById(id).patch({ is_active: true });
    return user;
  }

  // Create a new admin
  static async createAdmin(email, password, first_name, last_name) {
    const role = "admin";
    const user = await User.query().insert({ email, password, first_name, last_name, role });
    return user;
  }
}

module.exports = UserRepository;
