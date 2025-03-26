const { Model } = require("objection");
const User = require("./User");

class UserSocialLink extends Model {
  static get tableName() {
    return "user_social_links";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "platform"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        platform: { type: "string", minLength: 1, maxLength: 255 },
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
          from: "user_social_links.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserSocialLink;
