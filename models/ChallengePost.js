const { Model } = require("objection");
const Challenge = require("./Challenge");

class ChallengePost extends Model {
  static get tableName() {
    return "challenge_posts";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["post_id", "challenge_id"],
      properties: {
        id: { type: "integer" },
        post_id: { type: "integer" },
        challenge_id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
      },
    };
  }

  static get relationMappings() {
    return {
      challenge: {
        relation: Model.BelongsToOneRelation,
        modelClass: Challenge,
        join: {
          from: "challenge_posts.challenge_id",
          to: "challenges.id",
        },
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/ChallengePost",
        join: {
          from: "challenge_posts.post_id",
          to: "user_posts.id",
        },
      },
    };
  }
}

module.exports = ChallengePost;
