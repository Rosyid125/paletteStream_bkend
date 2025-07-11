const { Model } = require("objection");

class UserBadge extends Model {
  static get tableName() {
    return "user_badges";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "challenge_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        challenge_id: { type: "integer" },
        badge_img: { type: ["string", "null"], maxLength: 255 },
        admin_note: { type: ["string", "null"] },
        awarded_at: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const Challenge = require("./Challenge");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_badges.user_id",
          to: "users.id",
        },
      },
      challenge: {
        relation: Model.BelongsToOneRelation,
        modelClass: Challenge,
        join: {
          from: "user_badges.challenge_id",
          to: "challenges.id",
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

module.exports = UserBadge;
