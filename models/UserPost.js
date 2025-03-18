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
      required: ["user_id", "title", "description", "images", "tag_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1 },
        images: { type: "string", minLength: 1 },
        tag_id: { type: "integer" },
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
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: PostTag,
        join: {
          from: "user_posts.tag_id",
          to: "post_tags.id",
        },
      },
    };
  }
}

module.exports = UserPost;
