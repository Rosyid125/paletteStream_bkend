const { Model } = require("objection");

class PostTag extends Model {
  static get tableName() {
    return "post_tags";
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
    const GroupPost = require("./GroupPost");

    return {
      group_posts: {
        relation: Model.HasManyRelation,
        modelClass: GroupPost,
        join: {
          from: "post_tags.id",
          to: "group_posts.tag_id",
        },
      },
    };
  }
}

module.exports = PostTag;
