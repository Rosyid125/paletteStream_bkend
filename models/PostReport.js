const { Model } = require("objection");
const User = require("./User");
const UserPost = require("./UserPost");

class PostReport extends Model {
  static get tableName() {
    return "post_reports";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["post_id", "user_id", "reason"],
      properties: {
        id: { type: "integer" },
        post_id: { type: "integer" },
        user_id: { type: "integer" },
        reason: {
          type: "string",
          enum: ["inappropriate_content", "spam", "harassment", "copyright_violation", "fake_content", "violence", "adult_content", "hate_speech", "other"],
        },
        additional_info: { type: ["string", "null"], maxLength: 1000 },
        status: {
          type: "string",
          enum: ["pending", "reviewed", "resolved", "dismissed"],
          default: "pending",
        },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      reporter: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "post_reports.user_id",
          to: "users.id",
        },
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "post_reports.post_id",
          to: "user_posts.id",
        },
      },
    };
  }
}

module.exports = PostReport;
