const { Model } = require("objection");

class UserGroup extends Model {
  static get tableName() {
    return "user_groups";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "group_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        group_id: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const Group = require("./Group");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_groups.user_id",
          to: "users.id",
        },
      },
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: Group,
        join: {
          from: "user_groups.group_id",
          to: "groups.id",
        },
      },
    };
  }
}

module.exports = UserGroup;
