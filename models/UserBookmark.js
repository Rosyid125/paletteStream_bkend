const { Model } = require("objection");
const User = require("./User");
const UserPost = require("./UserPost");

class UserBookmark extends Model {
  static get tableName() {
    return "user_bookmarks";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "post_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        post_id: { type: "integer" },
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
          from: "user_bookmarks.user_id",
          to: "users.id",
        },
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "user_bookmarks.post_id",
          to: "user_posts.id",
        },
      },
    };
  }
}

module.exports = UserBookmark;
