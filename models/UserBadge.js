const { Model } = require("objection");
const User = require("./User");
const Badge = require("./Badge");

class UserBadge extends Model {
  static get tableName() {
    return "user_badges";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "badge_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        badge_id: { type: "integer" },
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
          from: "user_badges.user_id",
          to: "users.id",
        },
      },
      badge: {
        relation: Model.BelongsToOneRelation,
        modelClass: Badge,
        join: {
          from: "user_badges.badge_id",
          to: "badges.id",
        },
      },
    };
  }
}

module.exports = UserBadge;
