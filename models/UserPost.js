const { Model } = require("objection");
const User = require("./User");
const PostTag = require("./PostTag");

class UserPost extends Model {
  static get tableName() {
    return "user_posts";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "title", "description"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1 },
        type: { type: "string", enum: ["illustration", "manga", "novel"] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_posts.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserPost;
