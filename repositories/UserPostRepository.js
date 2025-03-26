// Import model
const UserPost = require("../models/UserPost");

class UserPostRepository {
  // Get all user posts
  static async findAll(offset, limit) {
    const userPosts = await UserPost.query()
      .withGraphJoined("user.[profile,experience]") // Ambil profile dan exp dari relasi user
      .orderBy("created_at", "desc")
      .offset(offset)
      .limit(limit);

    // console.log(userPosts);

    // console.log(JSON.stringify(userPosts, null, 2));

    // console.log(userPosts[0]);

    return userPosts;
  }

  // Get user post by id
  static async findById(id) {
    const userPost = await UserPost.query().findOne({ id });
    return userPost;
  }

  // Get user post by user id
  static async findByUserId(user_id, offset, limit) {
    const userPosts = await UserPost.query().where({ user_id }).orderBy("created_at", "desc").offset(offset).limit(limit); // Tidak perlu join user karena ini hanya di tampilkan di user profile page
    return userPosts;
  }

  // Get user posts by users ids (with pagination, order by created_at desc)
  static async findByUsersIds(user_ids, offset, limit) {
    const userPosts = await UserPost.query()
      .withGraphFetched("user.[profile,experience]") // Ambil profile dan exp dari relasi user
      .whereIn("user_id", user_ids)
      .orderBy("created_at", "desc")
      .offset(offset)
      .limit(limit);

    return userPosts;
  }

  // Create a new user post
  static async create(user_id, title, description, type) {
    const userPost = await UserPost.query().insert({
      user_id,
      title,
      description,
      type,
    });
    return userPost;
  }

  // Count user posts by user id
  static async countByUserId(user_id) {
    const result = await UserPost.query().where({ user_id }).count("user_id as count").first();
    return result?.count || 0;
  }

  // Update user post
  static async update(id, title, description, type) {
    const userPost = await UserPost.query().findOne({ id }).patch({ title, description, type });
    return userPost;
  }

  // Delete a user post
  static async delete(id) {
    const userPost = await UserPost.query().findOne({ id });
    if (!userPost) {
      return null;
    }
    await UserPost.query().findOne({ id }).delete();
    return userPost;
  }
}

module.exports = UserPostRepository;
