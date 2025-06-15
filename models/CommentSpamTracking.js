const { Model } = require("objection");
const db = require("../config/db");

Model.knex(db);

class CommentSpamTracking extends Model {
  static get tableName() {
    return "comment_spam_tracking";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "post_id", "comment_content", "content_hash"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        post_id: { type: "integer" },
        comment_content: { type: "string" },
        content_hash: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const UserPost = require("./UserPost");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comment_spam_tracking.user_id",
          to: "users.id",
        },
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "comment_spam_tracking.post_id",
          to: "user_posts.id",
        },
      },
    };
  }
}

module.exports = CommentSpamTracking;
