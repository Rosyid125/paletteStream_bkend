const { Model } = require("objection");
const UserAchievement = require("./UserAchievement");

class Achievement extends Model {
  static get tableName() {
    return "achievements";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "icon", "description", "goal"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        icon: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1 },
        goal: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      userAchievements: {
        relation: Model.HasManyRelation,
        modelClass: UserAchievement,
        join: {
          from: "achievements.id",
          to: "user_achievements.achievement_id",
        },
      },
    };
  }
}

module.exports = Achievement;
