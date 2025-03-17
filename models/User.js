const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password", "first_name", "last_name", "role"],
      properties: {
        id: { type: "integer" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
        first_name: { type: "string", minLength: 1, maxLength: 255 },
        last_name: { type: "string", minLength: 1, maxLength: 255 },
        role: { type: "string", enum: ["default", "admin"] },
        is_active: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = User;
