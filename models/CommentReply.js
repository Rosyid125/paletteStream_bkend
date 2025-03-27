const { Model } = require("objection");

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
        post_id: { type: "integer" },
        comment_id: { type: "integer" },
        user_id: { type: "integer" },
        content: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    const UserPost = require("./UserPost");
    const PostComment = require("./PostComment");
    const User = require("./User");

    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "comment_replies.post_id",
          to: "user_posts.id",
        },
      },
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
