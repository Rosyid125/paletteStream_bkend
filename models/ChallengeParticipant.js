const { Model } = require("objection");
const Challenge = require("./Challenge");
const User = require("./User");

class ChallengeParticipant extends Model {
  static get tableName() {
    return "challenge_participants";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["challenge_id", "user_id"],
      properties: {
        id: { type: "integer" },
        challenge_id: { type: "integer" },
        user_id: { type: "integer" },
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
          from: "challenge_participants.challenge_id",
          to: "challenges.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "challenge_participants.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = ChallengeParticipant;
