const { Model } = require("objection");

class ChallengePost extends Model {
  static get tableName() {
    return "challenge_posts";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["challenge_id", "post_id", "user_id"],
      properties: {
        id: { type: "integer" },
        challenge_id: { type: "integer" },
        post_id: { type: "integer" },
        user_id: { type: "integer" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const Challenge = require("./Challenge");
    const UserPost = require("./UserPost");
    const User = require("./User");

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
        modelClass: UserPost,
        join: {
          from: "challenge_posts.post_id",
          to: "user_posts.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "challenge_posts.user_id",
          to: "users.id",
        },
      },
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    this.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}

module.exports = ChallengePost;
