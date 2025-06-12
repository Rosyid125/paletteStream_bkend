const PostCommentRepository = require("../repositories/PostCommentRepository");
const CommentReplyRepository = require("../repositories/CommentReplyRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const customError = require("../errors/customError");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");
const { formatDate } = require("../utils/dateFormatterUtils");
const NotificationService = require("./NotificationService");
const MentionService = require("./MentionService");

class PostCommentService {
  // Get all post comments and comment replies
  static async getAll() {
    try {
      const postComments = await PostCommentRepository.findAll();
      const commentReplies = await CommentReplyRepository.findAll();
      return { postComments, commentReplies };
    } catch (error) {
      throw error;
    }
  }

  // Get post comment by id
  static async findById(id) {
    try {
      return await PostCommentRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get post comment by user id
  static async findByUserId(userId) {
    try {
      return await PostCommentRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }
  // Get post comment by post id
  static async findByPostId(postId, userId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      // Get all post comments by post id
      const postComments = await PostCommentRepository.findByPostId(postId, offset, limit); // Map all comment id to get comment replies count
      const commentIds = postComments.map((comment) => comment.id);
      const commentRepliesCountResult = await CommentReplyRepository.countByCommentIds(commentIds);

      // Assign comment replies count to each post comment
      postComments.forEach((comment) => {
        const commentId = comment.id;
        const commentRepliesCount = commentRepliesCountResult.find((count) => count.comment_id === commentId);
        comment.replies_count = commentRepliesCount ? parseInt(commentRepliesCount.count) : 0;
      });

      // Get post details
      const post = await UserPostRepository.findByPostId(postId);
      if (!post) throw new customError("Post not found", 404);

      // Get post images, tags, likes, comments count, like status, and bookmark status
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        require("../repositories/PostImageRepository").findByPostIds([postId]),
        require("../repositories/PostTagRepository").findByPostIds([postId]),
        require("../repositories/PostLikeRepository").countByPostIds([postId]),
        this.countByPostIds([postId]),
        require("../repositories/PostLikeRepository").getStatuses(userId, [postId]),
        require("../services/UserBookmarkService").getStatuses([postId], userId),
      ]);

      // Create maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, row) => {
        acc[row.post_id] = parseInt(row.count) || 0;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, row) => {
        acc[row.post_id] = parseInt(row.count) || 0;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true;
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true;
        return acc;
      }, {}); // Return post comments and post content with engagement data
      return {
        post: {
          id: post.id,
          userId: post.user_id,
          firstName: post.user.firstName,
          lastName: post.user.lastName,
          username: post.user.profile.username,
          avatar: post.user.profile.avatar,
          level: post.user.experience.level,
          createdAt: formatDate(post.created_at),
          type: post.type,
          title: post.title,
          description: post.description,
          images: imagesMap[post.id] || [],
          tags: tagsMap[post.id] || [],
          likeCount: likeCountMap[post.id] || 0,
          commentCount: commentCountMap[post.id] || 0,
          postLikeStatus: likeStatusMap[post.id] || false,
          bookmarkStatus: bookmarkStatusMap[post.id] || false,
        },
        comments: postComments.map((comment) => ({
          id: comment.id,
          user_id: comment.user_id,
          username: comment.user.profile.username,
          avatar: comment.user.profile.avatar,
          level: comment.user.experience.level,
          content: comment.content,
          likeCount: comment.likes || 0,
          commentCount: comment.replies_count,
          created_at: formatDate(comment.created_at),
          replies_count: comment.replies_count,
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  // Create a new post comment
  static async create(postId, userId, content) {
    try {
      // Create a new post comment
      const postComment = await PostCommentRepository.create(postId, userId, content);
      if (!postComment) {
        throw new customError("Post comment not found");
      }

      // Emit the gamification event for post comment
      gamificationEmitter.emit("commentOnPost", userId); // Get the userid from postId
      const post = await UserPostRepository.findByPostId(postId);
      if (post) {
        // Emit the gamification event for post got commented
        gamificationEmitter.emit("postGotCommented", post.user_id);

        // Send notification to post owner
        try {
          await NotificationService.notifyPostCommented(post.user_id, userId, postId, post.title, postComment.id, content);
        } catch (notificationError) {
          console.error("Failed to send comment notification:", notificationError);
        }

        // Process mentions in comment content
        try {
          await MentionService.processMentions(content, userId, postId, postComment.id, "comment");
        } catch (mentionError) {
          console.error("Failed to process mentions in comment:", mentionError);
        }
      }

      // Return post comment
      return postComment;
    } catch (error) {
      throw error;
    }
  }

  // Delete a post comment
  static async delete(id) {
    try {
      // Delete a post comment
      const postComment = await PostCommentRepository.delete(id);
      if (!postComment) {
        throw new customError("Post comment not found");
      }

      // Emit the gamification event for post comment deletion
      gamificationEmitter.emit("commentOnPostDeleted", postComment.user_id);

      // Get the postId from post comment
      const postId = postComment.post_id;
      // Get the userid from postId
      const post = await UserPostRepository.findByPostId(postId);
      if (post) {
        // Emit the gamification event for post got commented
        gamificationEmitter.emit("postGotUncommented", post.user_id);
      }

      // Return deleted post comment
      return postComment;
    } catch (error) {
      throw error;
    }
  }

  // Get comment reply by id
  static async getCommentReply(id) {
    try {
      return await CommentReplyRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get comment replies by user id
  static async getCommentRepliesByUserId(userId) {
    try {
      return await CommentReplyRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Get comment replies by comment id
  static async getCommentReplies(commentId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      // Get all comment replies by comment id
      const commentReplies = await CommentReplyRepository.findByCommentId(commentId, offset, limit);

      // Return comment replies
      return commentReplies.map((reply) => ({
        id: reply.id,
        user_id: reply.user_id,
        username: reply.user.profile.username,
        avatar: reply.user.profile.avatar,
        level: reply.user.experience.level,
        content: reply.content,
        created_at: formatDate(reply.created_at),
      }));
    } catch (error) {
      throw error;
    }
  }

  // Create a new comment reply
  static async createCommentReply(commentId, userId, content) {
    try {
      // Create a new comment reply
      const commentReply = await CommentReplyRepository.create(commentId, userId, content);

      // Return error if comment reply not found
      if (!commentReply) {
        throw new customError("Comment reply not found");
      }

      // Emit the gamification event for comment reply
      gamificationEmitter.emit("replyOnComment", userId);

      // Get the postId from commentId
      const postComment = await PostCommentRepository.findById(commentId);
      if (postComment) {
        // Get the userid from postId
        const post = await UserPostRepository.findByPostId(postComment.post_id);
        if (post) {
          // Emit the gamification event for post got commented
          gamificationEmitter.emit("commentGotReplied", post.user_id);
        } // Send notification to comment owner
        try {
          await NotificationService.notifyCommentReplied(postComment.user_id, userId, postComment.post_id, commentId, commentReply.id, content);
        } catch (notificationError) {
          console.error("Failed to send reply notification:", notificationError);
        }

        // Process mentions in reply content
        try {
          await MentionService.processMentions(content, userId, postComment.post_id, commentReply.id, "reply");
        } catch (mentionError) {
          console.error("Failed to process mentions in reply:", mentionError);
        }
      }

      // Return comment reply
      return commentReply;
    } catch (error) {
      throw error;
    }
  }

  // Delete a comment reply
  static async deleteCommentReply(id) {
    try {
      // Delete a comment reply
      const commentReply = await CommentReplyRepository.delete(id);
      if (!commentReply) {
        throw new customError("Comment reply not found");
      }

      // Emit the gamification event for comment reply deletion
      gamificationEmitter.emit("replyOnCommentDeleted", commentReply.user_id);

      // Get the postId from comment reply
      const postComment = await PostCommentRepository.findById(commentReply.comment_id);
      if (postComment) {
        // Get the userid from postId
        const post = await UserPostRepository.findByPostId(postComment.post_id);
        if (post) {
          // Emit the gamification event for post got commented
          gamificationEmitter.emit("commentGotUnreplied", post.user_id);
        }
      }

      // Return deleted comment reply
      return commentReply;
    } catch (error) {
      throw error;
    }
  }

  // Count post comments by post id
  static async countByPostId(postId) {
    try {
      // Count all post comments
      const postCommentsCountResult = await PostCommentRepository.countByPostId(postId);

      // Count all comment replies by comment ids
      const commentRepliesCountResult = await CommentReplyRepository.countByPostId(postId);

      // Sum the counts
      const totalCount = parseInt(postCommentsCountResult) + parseInt(commentRepliesCountResult);

      // Return the total count
      return totalCount;
    } catch (error) {
      throw error;
    }
  }

  // count post comments by post ids
  static async countByPostIds(postIds) {
    try {
      // Count post comments per post_id
      const postCommentsCountResult = await PostCommentRepository.countByPostIds(postIds);

      // Count comment replies per post_id
      const postRepliesCountResult = await CommentReplyRepository.countByPostIds(postIds);

      // Convert the results into a map for easy lookup
      const commentCountMap = postCommentsCountResult.reduce((acc, row) => {
        acc[row.post_id] = parseInt(row.count) || 0;
        return acc;
      }, {});

      const replyCountMap = postRepliesCountResult.reduce((acc, row) => {
        acc[row.post_id] = parseInt(row.count) || 0;
        return acc;
      }, {});

      // Merge both counts and sum them
      const finalCountMap = {};
      postIds.forEach((postId) => {
        const commentCount = commentCountMap[postId] || 0;
        const replyCount = replyCountMap[postId] || 0;
        finalCountMap[postId] = commentCount + replyCount;
      });

      const result = Object.entries(finalCountMap).map(([post_id, count]) => ({ post_id, count }));

      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostCommentService;
