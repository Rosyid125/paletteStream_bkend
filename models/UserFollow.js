const { Model } = require("objection");
const User = require("./User");

class UserFollow extends Model {
  static get tableName() {
    return "user_follows";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["follower_id", "followed_id"],
      properties: {
        id: { type: "integer" },
        follower_id: { type: "integer" },
        followed_id: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
  static get relationMappings() {
    return {
      follower: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_follows.follower_id",
          to: "users.id",
        },
      },
      followed: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_follows.followed_id",
          to: "users.id",
        },
      },
      followerUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_follows.follower_id",
          to: "users.id",
        },
      },
      followedUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_follows.followed_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserFollow;
