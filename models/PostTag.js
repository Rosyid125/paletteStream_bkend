const { Model } = require("objection");
const UserPost = require("./UserPost");
const Tag = require("./Tag");

class PostTag extends Model {
  static get tableName() {
    return "post_tags";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["post_id", "tag_id"],
      properties: {
        id: { type: "integer" },
        post_id: { type: "integer" },
        tag_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "post_tags.post_id",
          to: "user_posts.id",
        },
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tag,
        join: {
          from: "post_tags.tag_id",
          to: "tags.id",
        },
      },
    };
  }
}

module.exports = PostTag;
