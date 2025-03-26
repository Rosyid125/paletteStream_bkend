const { Model } = require("objection");

class UserPost extends Model {
  static get tableName() {
    return "user_posts";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "title", "description"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1 },
        type: { type: "string", enum: ["illustration", "manga", "novel"] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const ChallengePost = require("./ChallengePost");
    const PostComment = require("./PostComment");
    const PostLike = require("./PostLike");
    const PostImage = require("./PostImage");
    const PostTag = require("./PostTag");
    const UserBookmark = require("./UserBookmark");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_posts.user_id",
          to: "users.id",
        },
      },
      challengePost: {
        relation: Model.HasOneRelation,
        modelClass: ChallengePost,
        join: {
          from: "user_posts.id",
          to: "challenge_posts.user_post_id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: PostComment,
        join: {
          from: "user_posts.id",
          to: "post_comments.user_post_id",
        },
      },
      likes: {
        relation: Model.HasManyRelation,
        modelClass: PostLike,
        join: {
          from: "user_posts.id",
          to: "post_likes.user_post_id",
        },
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: PostImage,
        join: {
          from: "user_posts.id",
          to: "post_images.user_post_id",
        },
      },
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: PostTag,
        join: {
          from: "user_posts.id",
          through: {
            from: "post_tags.user_post_id",
            to: "post_tags.tag_id",
          },
          to: "tags.id",
        },
      },
      bookmarks: {
        relation: Model.HasManyRelation,
        modelClass: UserBookmark,
        join: {
          from: "user_posts.id",
          to: "user_bookmarks.user_post_id",
        },
      },
    };
  }
}

module.exports = UserPost;
