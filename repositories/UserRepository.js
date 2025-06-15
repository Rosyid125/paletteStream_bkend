// Import users model
const User = require("../models/User");
// For error handling
const currentRepo = "UserRepository";

class UserRepository {
  // Get all user ids with pagination
  static async findAllUserIds(offset, limit) {
    try {
      const users = await User.query().select("id").offset(offset).limit(limit);

      // Array of user ids
      const userIds = users.map((user) => user.id);

      return userIds;
    } catch (error) {
      throw error;
    }
  }

  // Get all users ids without pagination
  static async findAllUserIdsWithoutPagination() {
    try {
      const users = await User.query().select("id");

      // Array of user ids
      const userIds = users.map((user) => user.id);

      return userIds;
    } catch (error) {
      throw error;
    }
  }

  // Get user by id
  static async findById(id) {
    try {
      const user = await User.query().findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const user = await User.query().where("email", email).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async searchByUsernameOrNameOrEmail(query, offset, limit) {
    try {
      const users = await User.query()
        .joinRelated("profile") // join relasi profile
        .withGraphFetched("profile") // ambil juga relasi profile
        .where((builder) => {
          builder.where("profile.username", "like", `%${query}%`).orWhere("users.first_name", "like", `%${query}%`).orWhere("users.last_name", "like", `%${query}%`).orWhere("users.email", "like", `%${query}%`);
        })
        .offset(offset)
        .limit(limit);

      const userIds = users.map((user) => user.id);
      return userIds;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user
  static async create(email, password, first_name, last_name, role) {
    try {
      // Pastikan tidak ada value null, gunakan string kosong jika tidak ada value
      const safePassword = password || "";
      const safeFirstName = first_name || "";
      const safeLastName = last_name || "";
      const user = await User.query().insert({ email, password: safePassword, first_name: safeFirstName, last_name: safeLastName, role });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get all users with pagination
  static async findAll(offset, limit) {
    try {
      return await User.query().offset(offset).limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Get all users without pagination (for achievement system)
  static async findAllUsers() {
    try {
      return await User.query();
    } catch (error) {
      throw error;
    }
  }

  // Update user status (ban)
  static async updateStatus(id, status) {
    try {
      return await User.query().patchAndFetchById(id, { status });
    } catch (error) {
      throw error;
    }
  }

  // Update user data
  static async update(id, data) {
    try {
      return await User.query().patchAndFetchById(id, data);
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      return await User.query().deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  // Count all users
  static async countAll() {
    try {
      return await User.query().resultSize();
    } catch (error) {
      throw error;
    }
  }

  // Count banned users
  static async countBanned() {
    try {
      return await User.query().where("status", "banned").resultSize();
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  // Create a new admin
  static async createAdmin(email, password, first_name, last_name) {
    try {
      const role = "admin";
      const user = await User.query().insert({ email, password, first_name, last_name, role });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user after OTP register (set password, nama, role)
  static async updateUserAfterOtpRegister(id, password, first_name, last_name) {
    try {
      return await User.query().patchAndFetchById(id, {
        password,
        first_name,
        last_name,
        role: "default",
      });
    } catch (error) {
      throw error;
    }
  }

  // Update password by user id
  static async updatePasswordById(id, passwordHash) {
    try {
      return await User.query().patchAndFetchById(id, { password: passwordHash });
    } catch (error) {
      throw error;
    }
  }
  // Count new users by day (trend)
  static async countNewUsersByDay(days = 7) {
    // Validasi input untuk mencegah SQL injection
    const validDays = parseInt(days, 10);
    if (isNaN(validDays) || validDays <= 0 || validDays > 365) {
      throw new Error("Invalid days parameter");
    }

    // Menghitung jumlah user baru per hari selama N hari terakhir
    const result = await User.query()
      .select(User.raw("DATE(created_at) as date"))
      .count("id as count")
      .where("created_at", ">=", User.raw("DATE_SUB(CURDATE(), INTERVAL ? DAY)", [validDays]))
      .groupByRaw("DATE(created_at)")
      .orderBy("date", "asc");
    return result;
  }
  // Count new users by month (trend)
  static async countNewUsersByMonth(months = 6) {
    // Validasi input untuk mencegah SQL injection
    const validMonths = parseInt(months, 10);
    if (isNaN(validMonths) || validMonths <= 0 || validMonths > 24) {
      throw new Error("Invalid months parameter");
    }

    // Menghitung jumlah user baru per bulan selama N bulan terakhir
    const result = await User.query()
      .select(User.raw('DATE_FORMAT(created_at, "%Y-%m") as month'))
      .count("id as count")
      .where("created_at", ">=", User.raw("DATE_SUB(CURDATE(), INTERVAL ? MONTH)", [validMonths]))
      .groupByRaw('DATE_FORMAT(created_at, "%Y-%m")')
      .orderBy("month", "asc");
    return result;
  }
  // Create admin with email unique check
  static async createAdmin({ email, password, first_name, last_name }) {
    // Cek email sudah terdaftar
    const existing = await User.query().where("email", email).first();
    if (existing) throw new Error("Email already registered");
    return User.query().insert({ email, password, first_name, last_name, role: "admin", status: "active", is_active: true });
  }

  // Check if user exists by id
  static async existsById(id) {
    try {
      const user = await User.query().findById(id);
      return !!user;
    } catch (error) {
      throw error;
    }
  }

  // Update user with complete data (for admin edit)
  static async updateComplete(id, updateData) {
    try {
      // Filter only allowed fields and non-undefined values
      const allowedFields = ["email", "password", "first_name", "last_name", "role", "is_active", "status"];
      const filteredData = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields to update");
      }

      // Check if email is unique (if email is being updated)
      if (filteredData.email) {
        const existingUser = await User.query().where("email", filteredData.email).where("id", "!=", id).first();
        if (existingUser) {
          throw new Error("Email already exists");
        }
      }

      return await User.query().patchAndFetchById(id, filteredData);
    } catch (error) {
      throw error;
    }
  }

  // Get detailed user info with profile for admin
  static async getDetailedById(id) {
    try {
      const user = await User.query().findById(id).withGraphFetched("profile").select("users.*");

      if (!user) {
        return null;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
