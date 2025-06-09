// Import model
const UserPost = require("../models/UserPost");
// For error handling
const currentRepo = "UserPostRepository";

class UserPostRepository {
  // Get all user posts
  static async findAll(offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphJoined("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .orderBy("created_at", "desc")
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // findall randomized every time
  static async findAllRandomized(offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphJoined("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .orderByRaw("RAND()")
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // Get user post by post_id
  static async findByPostId(post_id) {
    try {
      // Fetch post with the given ID and related user, profile, and experience
      const userPost = await UserPost.query()
        .withGraphFetched("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .where({ id: post_id })
        .first(); // Get the first result
      return userPost;
    } catch (error) {
      throw error;
    }
  }

  // Get user post by post_ids
  static async findByPostIds(post_ids) {
    try {
      // Fetch posts with the array of IDs
      const userPosts = await UserPost.query().withGraphFetched("user.[profile,experience]").whereIn("id", post_ids);

      // Sort results to match the order of input IDs
      const sortedUserPosts = post_ids.map((id) => userPosts.find((post) => post.id === Number(id))).filter((post) => post !== undefined);

      return sortedUserPosts;
    } catch (error) {
      throw error;
    }
  }

  // Get user post by user id
  static async findByUserId(user_id, offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphFetched("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .where({ user_id })
        .orderBy("created_at", "desc")
        .offset(offset)
        .limit(limit);
      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // Get user posts by users ids (with pagination, order by created_at desc)
  static async findByUsersIds(user_ids, offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphFetched("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .whereIn("user_id", user_ids)
        .orderBy("created_at", "desc")
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  static async findSortedByEngagement(offset = 0, limit = 10) {
    try {
      const userPosts = await UserPost.query()
        .select("user_posts.*")
        .select(UserPost.relatedQuery("likes").count().as("likes_count"), UserPost.relatedQuery("comments").count().as("comments_count"), UserPost.relatedQuery("replies").count().as("replies_count"))
        .withGraphFetched("[user(selectUser).[profile(selectProfile), experience(selectExperience)], likes, comments, replies]")
        .modifiers({
          selectUser(builder) {
            builder.select("*");
          },
          selectProfile(builder) {
            builder.select("*");
          },
          selectExperience(builder) {
            builder.select("*");
          },
        })
        .groupBy("user_posts.id")
        .orderByRaw("(?? * 5 + ?? + ??) DESC", ["likes_count", "comments_count", "replies_count"]) // Likes dihargai 5x, comments dan replies 1x
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // Get all posts by tags
  static async findByTags(tag_ids, offset, limit) {
    try {
      const userPosts = await UserPost.query().withGraphFetched("[tags, user.[profile,experience]]").whereExists(UserPost.relatedQuery("tags").whereIn("tags.id", tag_ids)).orderBy("created_at", "desc").offset(offset).limit(limit);

      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // Get all posts by type
  static async findByType(type, offset, limit) {
    try {
      const userPosts = await UserPost.query().withGraphFetched("[user.[profile,experience]]").where({ type }).orderBy("created_at", "desc").offset(offset).limit(limit);
      console.log(userPosts);
      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // Get all posts by type and tags
  static async findByTitleAndDescription(titleDesc, offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphFetched("[user.[profile,experience]]")
        .whereRaw("LOWER(title) LIKE LOWER(?)", `%${titleDesc}%`)
        .orWhereRaw("LOWER(description) LIKE LOWER(?)", `%${titleDesc}%`)
        .orderBy("created_at", "desc")
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user post
  static async create(user_id, title, description, type) {
    try {
      const userPost = await UserPost.query().insert({
        user_id,
        title,
        description,
        type,
      });
      return userPost;
    } catch (error) {
      throw error;
    }
  }

  // Count user posts by user id
  static async countByUserId(user_id) {
    try {
      const result = await UserPost.query().where({ user_id }).count("user_id as count").first();
      return result?.count || 0;
    } catch (error) {
      throw error;
    }
  }

  // Update user post
  static async update(id, title, description, type) {
    try {
      const userPost = await UserPost.query().findOne({ id }).patch({ title, description, type });
      return userPost;
    } catch (error) {
      throw error;
    }
  }

  // Search post by title or description
  static async searchByTitleOrDesc(query, offset, limit) {
    try {
      return await UserPost.query().where("title", "like", `%${query}%`).orWhere("description", "like", `%${query}%`).offset(offset).limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Delete post
  static async delete(id) {
    try {
      return await UserPost.query().deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  // Count all posts
  static async countAll() {
    try {
      return await UserPost.query().resultSize();
    } catch (error) {
      throw error;
    }
  }

  // Count new posts by day (trend)
  static async countNewPostsByDay(days = 7) {
    const result = await UserPost.query()
      .select(UserPost.raw("DATE(created_at) as date"))
      .count("id as count")
      .where("created_at", ">=", UserPost.raw(`DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`))
      .groupByRaw("DATE(created_at)")
      .orderBy("date", "asc");
    return result;
  }

  // Count new posts by month (trend)
  static async countNewPostsByMonth(months = 6) {
    const result = await UserPost.query()
      .select(UserPost.raw('DATE_FORMAT(created_at, "%Y-%m") as month'))
      .count("id as count")
      .where("created_at", ">=", UserPost.raw(`DATE_SUB(CURDATE(), INTERVAL ${months} MONTH)`))
      .groupByRaw('DATE_FORMAT(created_at, "%Y-%m")')
      .orderBy("month", "asc");
    return result;
  }
}

module.exports = UserPostRepository;
