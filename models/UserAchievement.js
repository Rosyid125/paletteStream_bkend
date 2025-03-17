const { Model } = require("objection");
const User = require("./User");
const Achievement = require("./Achievement");

class UserAchievement extends Model {
  static get tableName() {
    return "user_achievements";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "achievement_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        achievement_id: { type: "integer" },
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
          from: "user_achievements.user_id",
          to: "users.id",
        },
      },
      achievement: {
        relation: Model.BelongsToOneRelation,
        modelClass: Achievement,
        join: {
          from: "user_achievements.achievement_id",
          to: "achievements.id",
        },
      },
    };
  }
}

module.exports = UserAchievement;
