const { Model } = require("objection");

class GroupPost extends Model {
  static get tableName() {
    return "group_posts";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["group_id", "created_by"],
      properties: {
        id: { type: "integer" },
        group_id: { type: "integer" },
        avatar: { type: ["string", "null"], maxLength: 255 },
        bio: { type: ["string", "null"], maxLength: 1000 },
        created_by: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const Group = require("./Group");

    return {
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: Group,
        join: {
          from: "group_posts.group_id",
          to: "groups.id",
        },
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "group_posts.created_by",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = GroupPost;
