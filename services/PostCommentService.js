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
  static async findByUserId(user_id) {
    return PostCommentRepository.findByUserId(user_id);
  }

  // Get post comment by post id
  static async findByPostId(post_id) {
    return PostCommentRepository.findByPostId(post_id);
  }

  // Create a new post comment
  static async create(post_id, user_id, content) {
    // Create a new post comment
    const postComment = await PostCommentRepository.create(post_id, user_id, content);
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
  static async getCommentRepliesByUserId(user_id) {
    return CommentReplyRepository.findByUserId(user_id);
  }

  // Get comment replies by comment id
  static async getCommentReplies(comment_id) {
    return CommentReplyRepository.findByCommentId(comment_id);
  }

  // Create a new comment reply
  static async createCommentReply(comment_id, user_id, content) {
    // Create a new comment reply
    const commentReply = await CommentReplyRepository.create(comment_id, user_id, content);
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

  // Count all comments and replies by post id\
  static async countByPostId(post_id) {
    const postComments = await PostCommentRepository.countByPostId(post_id);
    const commentReplies = await CommentReplyRepository.countByPostId(post_id);

    // Add both counts
    const count = postComments + commentReplies;
    return count;
  }
}

module.exports = PostCommentService;
