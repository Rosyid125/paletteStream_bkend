const { Model } = require("objection");

class UserAchievement extends Model {
  static get tableName() {
    return "user_achievements";
  }

  static get relationMappings() {
    const Achievement = require("./Achievement");
    const User = require("./User"); // Asumsikan User model ada

    return {
      achievement: {
        relation: Model.BelongsToOneRelation,
        modelClass: Achievement,
        join: {
          from: "user_achievements.achievement_id",
          to: "achievements.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_achievements.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserAchievement;
