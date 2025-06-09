const { Model } = require("objection");

class Achievement extends Model {
  static get tableName() {
    return "achievements";
  }

  static get relationMappings() {
    const UserAchievement = require("./UserAchievement");
    return {
      users: {
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
