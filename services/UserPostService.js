// Import all necessary repositories
import UserPostRepository from "../repositories/UserPostRepository";
import UserPostImageRepository from "../repositories/UserPostImageRepository";
import UserPostTagsRepository from "../repositories/UserPostTagsRepository";
import UserRepository from "../repositories/UserRepository";
import UserProfileRepository from "../repositories/UserRepository";
import UserExpRepository from "../repositories/UserExpRepository";
import TagRepository from "../repositories/TagRepository";

// Import needed services
import PostCommentService from "./PostCommentService";
import PostLikeService from "./PostLikeService";

// Define the UserPostService class
class UserPostService {
  // Static method to get all user posts and related data for a user profile page
  static async getUserPosts(userId) {
    try {
      // Get all posts by userId
      const userPosts = await UserPostRepository.findByUserId(userId);
      if (!userPosts || userPosts.length === 0) {
        return null;
      }

      // Extract post_ids from the user's posts
      const postIds = userPosts.map((post) => post.id);

      // Get all images for these posts
      const userPostImages = await UserPostImageRepository.findByPostIds(postIds);

      // Get all tags for these posts
      const userPostTags = await UserPostTagsRepository.findByPostIds(postIds);

      // Get all like counts for these posts
      const userPostLikeCounts = await PostLikeService.countByPostIds(postIds);

      // Get all comment counts for these posts
      const postCommentsCounts = await PostCommentService.countByPostIds(postIds);

      // Get the user information
      const user = await UserRepository.findById(userId);

      // Get the user profile information
      const userProfile = await UserProfileRepository.findById(userId);

      // Get the user experience information
      const userExp = await UserExpRepository.findByUserId(userId);

      // Assemble the data to return
      const postsWithDetails = userPosts.map((post) => {
        const postImages = userPostImages.filter((image) => image.post_id === post.id);
        const postTags = userPostTags.filter((tag) => tag.post_id === post.id);

        return {
          id: post.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: userProfile.username,
          avatar: userProfile.avatar,
          level: userExp.level,
          createdAt: post.createdAt,
          title: post.title,
          description: post.description,
          images: postImages.map((image) => image.image_url),
          tags: postTags.map((tag) => tag.name),
          likeCount: userPostLikeCounts.find((count) => count.post_id === post.id)?.count || 0,
          commentCount: postCommentsCounts.find((count) => count.post_id === post.id)?.count || 0,
        };
      });

      return postsWithDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to get all posts
  static async getAllPosts() {
    try {
      // Get all posts
      const userPosts = await UserPostRepository.findAll();
      if (!userPosts || userPosts.length === 0) {
        return null;
      }

      // Extract post_ids from the user's posts
      const postIds = userPosts.map((post) => post.id);

      // Get all images for these posts
      const userPostImages = await UserPostImageRepository.findByPostIds(postIds);

      // Get all tags for these posts
      const userPostTags = await UserPostTagsRepository.findByPostIds(postIds);

      // Get all like counts for these posts
      const postLikeCounts = await UserPostLikesRepository.countByPostIds(postIds);

      // Get all comment counts for these posts
      const postCommentsCounts = await UserPostCommentsRepository.countByPostIds(postIds);

      // Get the user information
      const userIds = userPosts.map((post) => post.user_id);
      const users = await UserRepository.findByIds(userIds);

      // Get the user profile information
      const userProfileIds = userPosts.map((post) => post.user_id);
      const userProfiles = await UserProfileRepository.findByIds(userProfileIds);

      // Get the user experience information
      const userExpIds = userPosts.map((post) => post.user_id);
      const userExps = await UserExpRepository.findByIds(userExpIds);

      // Assemble the data to return
      const postsWithDetails = userPosts.map((post) => {
        const postImages = userPostImages.filter((image) => image.post_id === post.id);
        const postTags = userPostTags.filter((tag) => tag.post_id === post.id);
        const user = users.find((user) => user.id === post.user_id);
        const userProfile = userProfiles.find((profile) => profile.user_id === post.user_id);
        const userExp = userExps.find((exp) => exp.user_id === post.user_id);

        return {
          id: post.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: userProfile.username,
          avatar: userProfile.avatar,
          level: userExp.level,
          createdAt: post.createdAt,
          title: post.title,
          description: post.description,
          images: postImages.map((image) => image.image_url),
          tags: postTags.map((tag) => tag.name),
          likeCount: postLikeCounts.find((count) => count.post_id === post.id)?.count || 0,
          commentCount: postCommentsCounts.find((count) => count.post_id === post.id)?.count || 0,
        };
      });

      return postsWithDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to create a new post
  static async createPost(userId, title, description, tags, images) {
    try {
      // Create a new post
      const post = await UserPostRepository.create(userId, title, description);

      // If tag does not exist, create a new tag
      tags = tags.map((tag) => TagRepository.findOrCreate(tag));

      // Create post tags
      const postTags = tags.map((tag) => UserPostTagsRepository.create(post.id, tag));

      // Create post images
      const postImages = images.map((image) => UserPostImageRepository.create(post.id, image));

      return { post, postTags, postImages };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to update a post
  static async updatePost(postId, title, description, tags, images) {
    try {
      // Update the post
      const post = await UserPostRepository.update(postId, title, description);

      // If tag does not exist, create a new tag
      tags = tags.map((tag) => TagRepository.findOrCreate(tag));

      // Delete post tags
      const postTags = await UserPostTagsRepository.deleteByPostId(postId);

      // Create post tags
      const newPostTags = tags.map((tag) => UserPostTagsRepository.create(postId, tag));

      // Delete post images
      const postImages = await UserPostImageRepository.deleteByPostId(postId);

      // Create post images
      const newPostImages = images.map((image) => UserPostImageRepository.create(postId, image));

      return { post, postTags, newPostTags, postImages, newPostImages };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to delete a post
  static async deletePost(postId) {
    try {
      // Delete the post
      const post = await UserPostRepository.delete(postId);

      // Delete post tags
      const postTags = await UserPostTagsRepository.deleteByPostId(postId);

      // Delete post images
      const postImages = await UserPostImageRepository.deleteByPostId(postId);

      return { post, postTags, postImages };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

// Export the UserPostService class
export default UserPostService;
