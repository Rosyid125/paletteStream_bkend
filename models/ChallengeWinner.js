const { Model } = require("objection");

class ChallengeWinner extends Model {
  static get tableName() {
    return "challenge_winners";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["challenge_id", "user_id", "post_id", "rank"],
      properties: {
        id: { type: "integer" },
        challenge_id: { type: "integer" },
        user_id: { type: "integer" },
        post_id: { type: "integer" },
        rank: { type: "integer", minimum: 1 },
        final_score: { type: "integer", minimum: 0 },
        admin_note: { type: ["string", "null"] },
        selected_at: { type: "string", format: "date-time" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Challenge = require("./Challenge");
    const User = require("./User");
    const UserPost = require("./UserPost");

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
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "challenge_winners.post_id",
          to: "user_posts.id",
        },
      },
    };
  }
  $beforeInsert() {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    this.created_at = now;
    this.updated_at = now;
    if (!this.selected_at) {
      this.selected_at = now;
    }
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}

module.exports = ChallengeWinner;
