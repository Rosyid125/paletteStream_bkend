const { Model } = require("objection");

class GroupPost extends Model {
  static get tableName() {
    return "group_posts";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["group_id", "title", "description", "images", "tag_id"],
      properties: {
        id: { type: "integer" },
        group_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1, maxLength: 1000 },
        images: { type: "string", minLength: 1, maxLength: 255 },
        tag_id: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Group = require("./Group");
    const PostTag = require("./PostTag");

    return {
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: Group,
        join: {
          from: "group_posts.group_id",
          to: "groups.id",
        },
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: PostTag,
        join: {
          from: "group_posts.tag_id",
          to: "post_tags.id",
        },
      },
    };
  }
}

module.exports = GroupPost;
