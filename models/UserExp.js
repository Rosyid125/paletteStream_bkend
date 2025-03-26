const { Model } = require("objection");

class UserExp extends Model {
  static get tableName() {
    return "user_exps";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "exp", "level"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        exp: { type: "integer", minimum: 0 },
        level: { type: "integer", minimum: 1 },
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
          from: "user_exps.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserExp;
