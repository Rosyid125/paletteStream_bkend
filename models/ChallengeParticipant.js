const { Model } = require("objection");

class Challenge extends Model {
  static get tableName() {
    return "challenges";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1, maxLength: 1000 },
        images: { type: ["string", "null"], maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const ChallengeParticipant = require("./ChallengeParticipant");

    return {
      participants: {
        relation: Model.HasManyRelation,
        modelClass: ChallengeParticipant,
        join: {
          from: "challenges.id",
          to: "challenge_participants.challenge_id",
        },
      },
    };
  }
}

module.exports = Challenge;
