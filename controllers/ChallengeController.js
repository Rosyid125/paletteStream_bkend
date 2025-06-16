const ChallengeService = require("../services/ChallengeService");
const BadgeService = require("../services/BadgeService");
const ChallengeWinnerService = require("../services/ChallengeWinnerService");
const customError = require("../errors/customError");
const jwt = require("jsonwebtoken");
const logger = require("../utils/winstonLogger");
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");

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

      // Handle file upload for badge image to Cloudinary
      let badgeImg = null;
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.buffer, "badges", {
            public_id: `badge_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          });
          badgeImg = result.secure_url;
        } catch (uploadError) {
          logger.error(`Error uploading badge image to Cloudinary: ${uploadError.message}`);
          throw new customError("Failed to upload badge image", 400);
        }
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

      // Handle file upload for badge image to Cloudinary
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.buffer, "badges", {
            public_id: `badge_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          });
          updateData.badge_img = result.secure_url;
        } catch (uploadError) {
          logger.error(`Error uploading badge image to Cloudinary: ${uploadError.message}`);
          throw new customError("Failed to upload badge image", 400);
        }
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
      let { id: challengeId } = req.params;
      // Ensure challengeId is a number
      challengeId = parseInt(challengeId, 10);
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
      let { id: challengeId } = req.params;

      // Ensure challengeId is a number
      challengeId = parseInt(challengeId, 10);

      const { winnersData, adminNote } = req.body;

      console.log("Selecting winners for challenge:", challengeId, "with winners:", winnersData);

      // Validate winnersData format: [{ userId, postId, rank }, ...]
      if (!Array.isArray(winnersData) || winnersData.length === 0) {
        throw new customError("Winners data must be provided as an array with userId, postId, and rank", 400);
      }

      // Validate each winner data
      for (const winner of winnersData) {
        if (!winner.userId || !winner.postId || !winner.rank) {
          throw new customError("Each winner must have userId, postId, and rank", 400);
        }
      }

      const result = await ChallengeWinnerService.selectWinners(challengeId, winnersData, adminNote);
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
      const winners = await ChallengeWinnerService.getChallengeWinners(id);
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

  // POST /challenges/:id/auto-select-winners - Auto-select winners based on likes (Admin only)
  static async autoSelectWinners(req, res) {
    try {
      let { id: challengeId } = req.params;
      challengeId = parseInt(challengeId, 10);

      const { maxWinners = 3, adminNote = "Auto-selected by system" } = req.body;

      const result = await ChallengeWinnerService.autoSelectWinnersByLikes(challengeId, maxWinners, adminNote);
      res.json(result);
    } catch (error) {
      logger.error(`Error auto-selecting winners: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
  // GET /user/wins - Get user's challenge wins
  static async getUserWins(req, res) {
    try {
      // Get user from token
      const token = req.cookies.accessToken;
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id;

      const wins = await ChallengeWinnerService.getUserWins(userId);
      res.json({ success: true, data: wins });
    } catch (error) {
      logger.error(`Error getting user wins: ${error.message}`, {
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
