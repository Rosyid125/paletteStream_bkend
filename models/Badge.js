const { Model } = require("objection");

class Badge extends Model {
  static get tableName() {
    return "badges";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "icon", "description"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        icon: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1, maxLength: 255 },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const UserBadge = require("./UserBadge");

    return {
      userBadges: {
        relation: Model.HasManyRelation,
        modelClass: UserBadge,
        join: {
          from: "badges.id",
          to: "user_badges.badge_id",
        },
      },
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    this.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}

module.exports = Badge;
