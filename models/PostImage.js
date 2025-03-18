const { Model } = require("objection");
const UserPost = require("./UserPost");

class PostImage extends Model {
  static get tableName() {
    return "post_images";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["post_id", "image_url"],
      properties: {
        id: { type: "integer" },
        post_id: { type: "integer" },
        image_url: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPost,
        join: {
          from: "post_images.post_id",
          to: "user_posts.id",
        },
      },
    };
  }
}

module.exports = PostImage;
