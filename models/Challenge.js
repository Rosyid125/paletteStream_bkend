const { Model } = require("objection");
const ChallengeParticipants = require("./ChallengeParticipant");
const ChallengePosts = require("./ChallengePost");
const ChallengePrizes = require("./ChallengePrize");
const ChallengeWinner = require("./ChallengeWinner");

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
        start_date: { type: "string", format: "date" },
        end_date: { type: "string", format: "date" },
        status: { type: "string", enum: ["open", "closed"] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      participants: {
        relation: Model.HasManyRelation,
        modelClass: ChallengeParticipants,
        join: {
          from: "challenges.id",
          to: "challenge_participants.challenge_id",
        },
      },
      posts: {
        relation: Model.HasManyRelation,
        modelClass: ChallengePosts,
        join: {
          from: "challenges.id",
          to: "challenge_posts.challenge_id",
        },
      },
      prizes: {
        relation: Model.HasManyRelation,
        modelClass: ChallengePrizes,
        join: {
          from: "challenges.id",
          to: "challenge_prizes.challenge_id",
        },
      },
      winners: {
        relation: Model.HasManyRelation,
        modelClass: ChallengeWinner,
        join: {
          from: "challenges.id",
          to: "challenge_winners.challenge_id",
        },
      },
    };
  }
}

module.exports = Challenge;
