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
    return {
      postTags: {
        relation: Model.HasManyRelation,
        modelClass: PostTag,
        join: {
          from: "tags.id",
          to: "post_tags.tag_id",
        },
      },
    };
  }
}

module.exports = Tag;
