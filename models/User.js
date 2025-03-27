const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password", "first_name", "last_name", "role"],
      properties: {
        id: { type: "integer" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
        first_name: { type: "string", minLength: 1, maxLength: 255 },
        last_name: { type: "string", minLength: 1, maxLength: 255 },
        role: { type: "string", enum: ["default", "admin"] },
        is_active: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const ChallengeWinner = require("./ChallengeWinner");
    const CommentReply = require("./CommentReply");
    const PostComment = require("./PostComment");
    const PostLike = require("./PostLike");
    const Token = require("./Token");
    const UserAchievement = require("./UserAchievement");
    const UserBadge = require("./UserBadge");
    const UserBookmark = require("./UserBookmark");
    const UserExp = require("./UserExp");
    const UserPost = require("./UserPost");
    const UserProfile = require("./UserProfile");
    const UserSocialLink = require("./UserSocialLink");

    return {
      profile: {
        relation: Model.HasOneRelation,
        modelClass: UserProfile,
        join: {
          from: "users.id",
          to: "user_profiles.user_id",
        },
      },
      posts: {
        relation: Model.HasManyRelation,
        modelClass: UserPost,
        join: {
          from: "users.id",
          to: "user_posts.user_id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: PostComment,
        join: {
          from: "users.id",
          to: "post_comments.user_id",
        },
      },
      likes: {
        relation: Model.HasManyRelation,
        modelClass: PostLike,
        join: {
          from: "users.id",
          to: "post_likes.user_id",
        },
      },
      tokens: {
        relation: Model.HasManyRelation,
        modelClass: Token,
        join: {
          from: "users.id",
          to: "tokens.user_id",
        },
      },
      achievements: {
        relation: Model.HasManyRelation,
        modelClass: UserAchievement,
        join: {
          from: "users.id",
          to: "user_achievements.user_id",
        },
      },
      badges: {
        relation: Model.HasManyRelation,
        modelClass: UserBadge,
        join: {
          from: "users.id",
          to: "user_badges.user_id",
        },
      },
      bookmarks: {
        relation: Model.HasManyRelation,
        modelClass: UserBookmark,
        join: {
          from: "users.id",
          to: "user_bookmarks.user_id",
        },
      },
      experience: {
        relation: Model.HasOneRelation,
        modelClass: UserExp,
        join: {
          from: "users.id",
          to: "user_exps.user_id",
        },
      },
      socialLinks: {
        relation: Model.HasManyRelation,
        modelClass: UserSocialLink,
        join: {
          from: "users.id",
          to: "user_social_links.user_id",
        },
      },
      challengeWinners: {
        relation: Model.HasManyRelation,
        modelClass: ChallengeWinner,
        join: {
          from: "users.id",
          to: "challenge_winners.user_id",
        },
      },
      commentReplies: {
        relation: Model.HasManyRelation,
        modelClass: CommentReply,
        join: {
          from: "users.id",
          to: "comment_replies.user_id",
        },
      },
    };
  }
}

module.exports = User;
