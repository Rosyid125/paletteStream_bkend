const PostCommentRepository = require("../repositories/PostCommentRepository");
const CommentReplyRepository = require("../repositories/CommentReplyRepository");

class PostCommentService {
  // Get all post comments and comment replies
  static async getAll() {
    const postComments = await PostCommentRepository.findAll();
    const commentReplies = await CommentReplyRepository.findAll();
    return { postComments, commentReplies };
  }

  // Get post comment by id
  static async findById(id) {
    return PostCommentRepository.findById(id);
  }

  // Get post comment by user id
  static async findByUserId(userId) {
    return PostCommentRepository.findByUserId(userId);
  }

  // Get post comment by post id
  static async findByPostId(postId, page, limit) {
    // Pagination setup
    const offset = (page - 1) * limit;

    // Get all post comments by post id
    const postComments = await PostCommentRepository.findByPostId(postId, offset, limit);

    // Return post comments
    return postComments.map((comment) => ({
      id: comment.id,
      user_id: comment.user_id,
      username: comment.user.profile.username,
      avatar: comment.user.profile.avatar,
      level: comment.user.experience.level,
      content: comment.content,
      created_at: comment.created_at,
    }));
  }

  // Create a new post comment
  static async create(postId, userId, content) {
    // Create a new post comment
    const postComment = await PostCommentRepository.create(postId, userId, content);
    if (!postComment) {
      throw new Error("Post comment not found");
    }

    // Return post comment
    return postComment;
  }

  // Delete a post comment
  static async delete(id) {
    // Delete a post comment
    const postComment = await PostCommentRepository.delete(id);
    if (!postComment) {
      throw new Error("Post comment not found");
    }

    // Return deleted post comment
    return postComment;
  }

  // Get comment reply by id
  static async getCommentReply(id) {
    return CommentReplyRepository.findById(id);
  }

  // Get comment replies by user id
  static async getCommentRepliesByUserId(userId) {
    return CommentReplyRepository.findByUserId(userId);
  }

  // Get comment replies by comment id
  static async getCommentReplies(commentId, page, limit) {
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
      created_at: reply.created_at,
    }));
  }

  // Create a new comment reply
  static async createCommentReply(commentId, userId, content) {
    // Create a new comment reply
    const commentReply = await CommentReplyRepository.create(commentId, userId, content);

    // Return error if comment reply not found
    if (!commentReply) {
      throw new Error("Comment reply not found");
    }

    // Return comment reply
    return commentReply;
  }

  // Delete a comment reply
  static async deleteCommentReply(id) {
    // Delete a comment reply
    const commentReply = await CommentReplyRepository.delete(id);
    if (!commentReply) {
      throw new Error("Comment reply not found");
    }

    // Return deleted comment reply
    return commentReply;
  }

  // Count post comments by post id
  static async countByPostId(postId) {
    // Count all post comments
    const postCommentsCountResult = await PostCommentRepository.countByPostId(postId);

    // Get comments ids from post id
    const postComments = await PostCommentRepository.getPostCommentIdsByPostId(postId);

    // Map all comment ids
    const commentIds = postComments.map((comment) => comment.id);

    // Count all comment replies by comment ids
    const commentRepliesCountResult = await CommentReplyRepository.countByCommentIds(commentIds);

    console.log(commentRepliesCountResult, postCommentsCountResult);

    const totalCount = (commentRepliesCountResult[0] || 0) + (postCommentsCountResult[0] || 0);

    // Return the total count
    return totalCount;
  }

  // count post comments by post ids
  static async countByPostIds(postIds) {
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
  }
}

module.exports = PostCommentService;
