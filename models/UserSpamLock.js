const { Model } = require("objection");
const db = require("../config/db");

Model.knex(db);

class UserSpamLock extends Model {
  static get tableName() {
    return "user_spam_locks";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "spam_type", "unlock_at"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        spam_type: { type: "string" },
        spam_data: { type: "object" },
        locked_at: { type: "string" },
        unlock_at: { type: "string" },
        is_active: { type: "boolean" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
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
          from: "user_spam_locks.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserSpamLock;
