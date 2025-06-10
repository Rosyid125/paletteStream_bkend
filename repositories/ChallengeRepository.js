const Challenge = require("../models/Challenge");

class ChallengeRepository {
  // Get all challenges
  static async findAll() {
    try {
      const challenges = await Challenge.query().withGraphFetched("[creator.[profile], challengePosts.post.[images, tags.tag, user.[profile, experience]]]").orderBy("created_at", "desc");
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Get active challenges (not closed and deadline not passed)
  static async findActive() {
    try {
      const challenges = await Challenge.query()
        .withGraphFetched("[creator.[profile], challengePosts.post.[images, tags.tag, user.[profile, experience]]]")
        .where("is_closed", false)
        .where("deadline", ">", new Date().toISOString())
        .orderBy("created_at", "desc");
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Get challenge by ID
  static async findById(id) {
    try {
      const challenge = await Challenge.query().findById(id).withGraphFetched("[creator.[profile], challengePosts.post.[images, tags.tag, user.[profile, experience]], userBadges.user.[profile]]");
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Get challenges created by a user
  static async findByCreator(userId) {
    try {
      const challenges = await Challenge.query().where("created_by", userId).withGraphFetched("[challengePosts.post.[images, tags.tag, user.[profile, experience]]]").orderBy("created_at", "desc");
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Get expired challenges that are not closed
  static async findExpiredNotClosed() {
    try {
      const challenges = await Challenge.query().where("is_closed", false).where("deadline", "<=", new Date().toISOString());
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Create a new challenge
  static async create(title, description, badgeImg, deadline, createdBy) {
    try {
      const challenge = await Challenge.query().insert({
        title,
        description,
        badge_img: badgeImg,
        deadline,
        created_by: createdBy,
      });
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Update challenge
  static async update(id, updateData) {
    try {
      const challenge = await Challenge.query().findById(id).patch(updateData);
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Close challenge
  static async close(id) {
    try {
      const challenge = await Challenge.query().findById(id).patch({ is_closed: true });
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Delete challenge
  static async delete(id) {
    try {
      const deletedCount = await Challenge.query().deleteById(id);
      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get challenge posts with like counts for leaderboard
  static async getChallengeLeaderboard(challengeId) {
    try {
      const challenge = await Challenge.query().findById(challengeId).withGraphFetched(`[
          challengePosts.post.[
            images, 
            tags.tag, 
            user.[profile, experience],
            likes,
            comments
          ]
        ]`);

      if (!challenge) return null;

      // Sort posts by likes count
      if (challenge.challengePosts) {
        challenge.challengePosts.sort((a, b) => {
          const likesA = a.post.likes ? a.post.likes.length : 0;
          const likesB = b.post.likes ? b.post.likes.length : 0;
          return likesB - likesA;
        });
      }

      return challenge;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeRepository;
