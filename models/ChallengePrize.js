const { Model } = require("objection");
const Challenge = require("./Challenge");
const Achievement = require("./Achievement");
const Badge = require("./Badge");

class ChallengePrize extends Model {
  static get tableName() {
    return "challenge_prizes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["challenge_id"],
      properties: {
        id: { type: "integer" },
        challenge_id: { type: "integer" },
        achievement_id: { type: ["integer", "null"] },
        badge_id: { type: ["integer", "null"] },
        exp: { type: ["integer", "null"] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      challenge: {
        relation: Model.BelongsToOneRelation,
        modelClass: Challenge,
        join: {
          from: "challenge_prizes.challenge_id",
          to: "challenges.id",
        },
      },
      achievement: {
        relation: Model.BelongsToOneRelation,
        modelClass: Achievement,
        join: {
          from: "challenge_prizes.achievement_id",
          to: "achievements.id",
        },
      },
      badge: {
        relation: Model.BelongsToOneRelation,
        modelClass: Badge,
        join: {
          from: "challenge_prizes.badge_id",
          to: "badges.id",
        },
      },
    };
  }
}

module.exports = ChallengePrize;
