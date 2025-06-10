const ChallengeService = require("../services/ChallengeService");
const BadgeService = require("../services/BadgeService");
const customError = require("../errors/customError");
const jwt = require("jsonwebtoken");
const logger = require("../utils/winstonLogger");

class ChallengeController {
  // GET /challenges - Get all challenges
  static async getAllChallenges(req, res) {
    try {
      const challenges = await ChallengeService.getAllChallenges();
      res.json({ success: true, data: challenges });
    } catch (error) {
      logger.error(`Error getting challenges: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /challenges/active - Get active challenges only
  static async getActiveChallenges(req, res) {
    try {
      const challenges = await ChallengeService.getActiveChallenges();
      res.json({ success: true, data: challenges });
    } catch (error) {
      logger.error(`Error getting active challenges: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /challenges/:id - Get challenge by ID
  static async getChallengeById(req, res) {
    try {
      const { id } = req.params;
      const challenge = await ChallengeService.getChallengeById(id);
      res.json({ success: true, data: challenge });
    } catch (error) {
      logger.error(`Error getting challenge by ID: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // POST /challenges - Create new challenge (Admin only)
  static async createChallenge(req, res) {
    try {
      const { title, description, deadline } = req.body;

      // Get user from token
      const token = req.cookies.accessToken;
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id;

      // Handle file upload for badge image
      let badgeImg = null;
      if (req.file) {
        badgeImg = req.file.path; // Multer provides the file path
      }

      const challenge = await ChallengeService.createChallenge(title, description, badgeImg, deadline, userId);

      res.status(201).json({ success: true, data: challenge });
    } catch (error) {
      logger.error(`Error creating challenge: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // PUT /challenges/:id - Update challenge (Admin only)
  static async updateChallenge(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Handle file upload for badge image
      if (req.file) {
        updateData.badge_img = req.file.path;
      }

      const challenge = await ChallengeService.updateChallenge(id, updateData);
      res.json({ success: true, data: challenge });
    } catch (error) {
      logger.error(`Error updating challenge: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // PUT /challenges/:id/close - Close challenge manually (Admin only)
  static async closeChallenge(req, res) {
    try {
      const { id } = req.params;
      const result = await ChallengeService.closeChallenge(id);
      res.json(result);
    } catch (error) {
      logger.error(`Error closing challenge: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // DELETE /challenges/:id - Delete challenge (Admin only)
  static async deleteChallenge(req, res) {
    try {
      const { id } = req.params;
      const result = await ChallengeService.deleteChallenge(id);
      res.json(result);
    } catch (error) {
      logger.error(`Error deleting challenge: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // POST /challenges/:id/submit-post - Submit post to challenge
  static async submitPostToChallenge(req, res) {
    try {
      const { id: challengeId } = req.params;
      const { postId } = req.body;

      // Get user from token
      const token = req.cookies.accessToken;
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id;

      const challengePost = await ChallengeService.submitPostToChallenge(challengeId, postId, userId);
      res.status(201).json({ success: true, data: challengePost });
    } catch (error) {
      logger.error(`Error submitting post to challenge: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /challenges/:id/leaderboard - Get challenge leaderboard
  static async getChallengeLeaderboard(req, res) {
    try {
      const { id } = req.params;
      const leaderboard = await ChallengeService.getChallengeLeaderboard(id);
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      logger.error(`Error getting challenge leaderboard: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // POST /challenges/:id/select-winners - Select winners and award badges (Admin only)
  static async selectWinners(req, res) {
    try {
      const { id: challengeId } = req.params;
      const { winnerUserIds, adminNote } = req.body;

      if (!Array.isArray(winnerUserIds) || winnerUserIds.length === 0) {
        throw new customError("Winner user IDs must be provided as an array", 400);
      }

      const result = await BadgeService.selectWinnersAndAwardBadges(challengeId, winnerUserIds, adminNote);
      res.json(result);
    } catch (error) {
      logger.error(`Error selecting winners: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /challenges/:id/winners - Get challenge winners
  static async getChallengeWinners(req, res) {
    try {
      const { id } = req.params;
      const winners = await BadgeService.getChallengeWinners(id);
      res.json({ success: true, data: winners });
    } catch (error) {
      logger.error(`Error getting challenge winners: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /user/challenge-history - Get user's challenge history
  static async getUserChallengeHistory(req, res) {
    try {
      // Get user from token
      const token = req.cookies.accessToken;
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id;

      const history = await ChallengeService.getUserChallengeHistory(userId);
      res.json({ success: true, data: history });
    } catch (error) {
      logger.error(`Error getting user challenge history: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
}

module.exports = ChallengeController;
