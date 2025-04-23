const UserBookmarkRepository = require("../repositories/UserBookmarkRepository.js");
const customError = require("../errors/customError");
const { gamificationEmitter } = require("../emitters/gamificationEmitter.js");

class UserBookmarkService {
  // Get all post ids that are bookmarked by user id
  static async findPostIdsByUserId(userId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      const postids = await UserBookmarkRepository.findPostIdsByUserId(userId, offset, limit);
      return postids;
    } catch (error) {
      throw error;
    }
  }

  // Get all user bookmark status by post ids and user id
  static async getStatuses(postIds, userId) {
    try {
      const result = await UserBookmarkRepository.getStatuses(postIds, userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Create and delete a user bookmark
  static async createDelete(postId, userId) {
    try {
      // Check if user bookmark already exists
      const existingBookmark = await UserBookmarkRepository.findByUserIdAndPostId(postId, userId);

      if (existingBookmark) {
        // If it exists, delete the bookmark
        await UserBookmarkRepository.delete(userId, postId);

        // Get userid from postId
        const post = await UserBookmarkRepository.findByPostId(postId);
        if (post) {
          // Emit the gamification event for post got unbookmarked
          gamificationEmitter.emit("postGotUnbookmarked", post.user_id);
        }

        return { message: "Post bookmark deleted" };
      }

      // Create a new user bookmark
      const userBookmark = await UserBookmarkRepository.create(userId, postId);

      // Check if user bookmark was created successfully
      if (!userBookmark) {
        throw new customError(`UserBookmarkService Error: Post bookmark cannot be created`);
      } else {
        // Emit the gamification event for post bookmark created
        const post = await UserBookmarkRepository.findByPostId(postId);
        if (post) {
          gamificationEmitter.emit("postGotBookmarked", post.user_id);
        }
        // If it was created successfully, return the user bookmark
        const userBookmarkData = {
          id: userBookmark.id,
          user_id: userBookmark.user_id,
          post_id: userBookmark.post_id,
          created_at: userBookmark.created_at,
          updated_at: userBookmark.updated_at,
        };

        // Return success message with user bookmark data
        return { message: "Post bookmark created", data: userBookmarkData };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserBookmarkService;
