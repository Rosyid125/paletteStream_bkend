const { Model } = require("objection");

class Challenge extends Model {
  static get tableName() {
    return "challenges";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description", "deadline", "created_by"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1 },
        badge_img: { type: ["string", "null"], maxLength: 255 },
        deadline: { type: "string" },
        is_closed: { type: "boolean", default: false },
        created_by: { type: "integer" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }
  static get relationMappings() {
    const User = require("./User");
    const ChallengePost = require("./ChallengePost");
    const UserBadge = require("./UserBadge");

    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "challenges.created_by",
          to: "users.id",
        },
      },
      challengePosts: {
        relation: Model.HasManyRelation,
        modelClass: ChallengePost,
        join: {
          from: "challenges.id",
          to: "challenge_posts.challenge_id",
        },
      },
      userBadges: {
        relation: Model.HasManyRelation,
        modelClass: UserBadge,
        join: {
          from: "challenges.id",
          to: "user_badges.challenge_id",
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

  // Helper method to check if challenge is active
  get isActive() {
    return !this.is_closed && new Date(this.deadline) > new Date();
  }

  // Helper method to check if challenge is expired
  get isExpired() {
    return new Date(this.deadline) <= new Date();
  }
}

module.exports = Challenge;
