const { Model } = require("objection");
const PostTag = require("./PostTag");

class Tag extends Model {
  static get tableName() {
    return "tags";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
  static get relationMappings() {
    const PostTag = require("./PostTag");
    const UserPost = require("./UserPost");

    return {
      postTags: {
        relation: Model.HasManyRelation,
        modelClass: PostTag,
        join: {
          from: "tags.id",
          to: "post_tags.tag_id",
        },
      },
      posts: {
        relation: Model.ManyToManyRelation,
        modelClass: UserPost,
        join: {
          from: "tags.id",
          through: {
            from: "post_tags.tag_id",
            to: "post_tags.post_id",
          },
          to: "user_posts.id",
        },
      },
    };
  }
}

module.exports = Tag;
