const { Model } = require("objection");
const User = require("./User");

class UserProfile extends Model {
  static get tableName() {
    return "user_profiles";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 255 },
        avatar: { type: "string", nullable: true },
        bio: { type: "string", nullable: true },
        location: { type: "string", nullable: true },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_profiles.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserProfile;
