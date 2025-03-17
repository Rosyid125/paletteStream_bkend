const { Model } = require("objection");

class ChallengeWinner extends Model {
  static get tableName() {
    return "challenge_winners";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["challenge_id", "user_id", "rank"],
      properties: {
        id: { type: "integer" },
        challenge_id: { type: "integer" },
        user_id: { type: "integer" },
        rank: { type: "integer", enum: [1, 2, 3] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Challenge = require("./Challenge");
    const User = require("./User");

    return {
      challenge: {
        relation: Model.BelongsToOneRelation,
        modelClass: Challenge,
        join: {
          from: "challenge_winners.challenge_id",
          to: "challenges.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "challenge_winners.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = ChallengeWinner;
