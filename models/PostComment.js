const { Model } = require("objection");
const User = require("./User");
const UserPost = require("./UserPost");

class PostComment extends Model {
  static get tableName() {
    return "post_comments";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["post_id", "user_id", "content"],
      properties: {
        id: { type: "integer" },
        post_id: { type: "integer" },
        user_id: { type: "integer" },
        content: { type: "string", minLength: 1, maxLength: 1000 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "post_comments.post_id",
          to: "user_posts.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "post_comments.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = PostComment;
