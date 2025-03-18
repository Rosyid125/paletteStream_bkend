const { Model } = require("objection");
const knex = require("../config/db"); // Adjust the path as necessary

Model.knex(knex);

class CommentReply extends Model {
  static get tableName() {
    return "comment_replies";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["comment_id", "user_id", "content"],
      properties: {
        id: { type: "integer" },
        comment_id: { type: "integer" },
        user_id: { type: "integer" },
        content: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    const PostComment = require("./PostComment");
    const User = require("./User");

    return {
      comment: {
        relation: Model.BelongsToOneRelation,
        modelClass: PostComment,
        join: {
          from: "comment_replies.comment_id",
          to: "post_comments.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comment_replies.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = CommentReply;
