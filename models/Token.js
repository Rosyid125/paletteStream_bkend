const { Model } = require("objection");

class Token extends Model {
  static get tableName() {
    return "tokens";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "refresh_token", "expires_at"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        refresh_token: { type: "string" },
        expires_at: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tokens.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Token;
