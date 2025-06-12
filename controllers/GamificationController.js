const UserExpService = require("../services/UserExpService");
const AchievementService = require("../services/AchievementService");
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const ChallengeService = require("../services/ChallengeService");
const ChallengeWinnerService = require("../services/ChallengeWinnerService");
const customError = require("../errors/customError");
const jwt = require("jsonwebtoken");
const logger = require("../utils/winstonLogger");

class GamificationController {
  // GET /gamification/hub - Get complete gamification data for current user
  static async getGamificationHub(req, res) {
    try {
      // Get user from token
      const token = req.cookies.accessToken;
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Get all gamification data concurrently
      const [userExp, allAchievements, userAchievements, userBadges, activeChallenges, userWins] = await Promise.all([
        UserExpService.getUserExpByUserId(userId),
        AchievementService.getAllAchievements(),
        UserAchievementRepository.findByUserId(userId),
        UserBadgeRepository.findByUserIdWithRank(userId),
        ChallengeService.getActiveChallenges(),
        ChallengeWinnerService.getUserWins(userId),
      ]);

      // Process achievements data
      const achievementsData = allAchievements.map((achievement) => {
        const userAchievement = userAchievements.find((ua) => ua.achievement_id === achievement.id);
        const progress = userAchievement ? userAchievement.progress : 0;
        const status = userAchievement ? userAchievement.status : "in-progress";

        return {
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon,
          description: achievement.description,
          goal: achievement.goal,
          progress: progress,
          status: status,
          percentage: Math.round((progress / achievement.goal) * 100),
          is_completed: status === "completed",
        };
      });

      // Separate completed and in-progress achievements
      const completedAchievements = achievementsData.filter((a) => a.is_completed);
      const inProgressAchievements = achievementsData.filter((a) => !a.is_completed); // Process badges data
      const badgesData = userBadges.map((badge) => {
        const rank = badge.rank;
        let rank_display = "Participant";

        if (rank) {
          if (rank === 1) {
            rank_display = "Winner";
          } else if (rank === 2) {
            rank_display = "2nd Place";
          } else if (rank === 3) {
            rank_display = "3rd Place";
          } else {
            rank_display = `${rank}th Place`;
          }
        }

        return {
          id: badge.id,
          challenge_id: badge.challenge_id,
          challenge_title: badge.challenge?.title || "Challenge",
          badge_img: badge.badge_img,
          earned_at: badge.awarded_at || badge.created_at,
          admin_note: badge.admin_note,
          rank: rank || null,
          rank_display: rank_display,
        };
      });

      // Process active challenges data
      const challengesData = activeChallenges.map((challenge) => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        badge_img: challenge.badge_img,
        deadline: challenge.deadline,
        status: challenge.status,
        participants_count: challenge.participants_count || 0,
        posts_count: challenge.posts_count || 0,
        days_left: challenge.days_left,
      }));

      // Calculate statistics
      const stats = {
        level: userExp.level,
        exp: userExp.exp,
        current_threshold: userExp.current_treshold,
        next_threshold: userExp.next_treshold,
        exp_to_next_level: userExp.next_treshold - userExp.exp,
        level_progress_percentage: Math.round(((userExp.exp - userExp.current_treshold) / (userExp.next_treshold - userExp.current_treshold)) * 100),
        total_achievements: allAchievements.length,
        completed_achievements: completedAchievements.length,
        achievement_completion_percentage: Math.round((completedAchievements.length / allAchievements.length) * 100),
        total_badges: badgesData.length,
        challenge_wins: userWins.length,
        active_challenges: challengesData.length,
      };

      const response = {
        user_id: userId,
        stats: stats,
        level_info: {
          current_level: userExp.level,
          current_exp: userExp.exp,
          current_threshold: userExp.current_treshold,
          next_threshold: userExp.next_treshold,
          progress_percentage: stats.level_progress_percentage,
          exp_needed: stats.exp_to_next_level,
        },
        achievements: {
          total: allAchievements.length,
          completed: completedAchievements.length,
          completion_percentage: stats.achievement_completion_percentage,
          recent_completed: completedAchievements.slice(-3), // Last 3 completed
          in_progress: inProgressAchievements.slice(0, 5), // First 5 in progress
        },
        badges: {
          total: badgesData.length,
          recent: badgesData.slice(-3), // Last 3 earned badges
          all: badgesData,
        },
        challenges: {
          active: challengesData.slice(0, 3), // Show top 3 active challenges
          total_active: challengesData.length,
          user_wins: userWins.length,
          recent_wins: userWins.slice(-3), // Last 3 wins
        },
      };

      res.json({ success: true, data: response });
    } catch (error) {
      logger.error(`Error getting gamification hub: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /gamification/level/:userId - Get level info for specific user
  static async getUserLevel(req, res) {
    try {
      const { userId } = req.params;

      if (!userId || isNaN(userId)) {
        throw new customError("Valid user ID required", 400);
      }

      const userExp = await UserExpService.getUserExpByUserId(parseInt(userId));

      if (!userExp) {
        throw new customError("User not found", 404);
      }

      const levelInfo = {
        user_id: parseInt(userId),
        level: userExp.level,
        exp: userExp.exp,
        current_threshold: userExp.current_treshold,
        next_threshold: userExp.next_treshold,
        exp_to_next_level: userExp.next_treshold - userExp.exp,
        progress_percentage: Math.round(((userExp.exp - userExp.current_treshold) / (userExp.next_treshold - userExp.current_treshold)) * 100),
      };

      res.json({ success: true, data: levelInfo });
    } catch (error) {
      logger.error(`Error getting user level: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /gamification/achievements/:userId - Get achievements for specific user
  static async getUserAchievements(req, res) {
    try {
      const { userId } = req.params;
      const { status } = req.query; // 'completed', 'in-progress', or 'all'

      if (!userId || isNaN(userId)) {
        throw new customError("Valid user ID required", 400);
      }

      const [allAchievements, userAchievements] = await Promise.all([AchievementService.getAllAchievements(), UserAchievementRepository.findByUserId(parseInt(userId))]);

      const achievementsData = allAchievements.map((achievement) => {
        const userAchievement = userAchievements.find((ua) => ua.achievement_id === achievement.id);
        const progress = userAchievement ? userAchievement.progress : 0;
        const achievementStatus = userAchievement ? userAchievement.status : "in-progress";

        return {
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon,
          description: achievement.description,
          goal: achievement.goal,
          progress: progress,
          status: achievementStatus,
          percentage: Math.round((progress / achievement.goal) * 100),
          is_completed: achievementStatus === "completed",
          unlocked_at: userAchievement?.updated_at || null,
        };
      });

      // Filter based on status query parameter
      let filteredAchievements = achievementsData;
      if (status === "completed") {
        filteredAchievements = achievementsData.filter((a) => a.is_completed);
      } else if (status === "in-progress") {
        filteredAchievements = achievementsData.filter((a) => !a.is_completed);
      }

      const summary = {
        total: allAchievements.length,
        completed: achievementsData.filter((a) => a.is_completed).length,
        in_progress: achievementsData.filter((a) => !a.is_completed).length,
        completion_percentage: Math.round((achievementsData.filter((a) => a.is_completed).length / allAchievements.length) * 100),
      };

      res.json({
        success: true,
        data: {
          summary: summary,
          achievements: filteredAchievements,
        },
      });
    } catch (error) {
      logger.error(`Error getting user achievements: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
  // GET /gamification/badges/:userId - Get badges for specific user
  static async getUserBadges(req, res) {
    try {
      const { userId } = req.params;

      if (!userId || isNaN(userId)) {
        throw new customError("Valid user ID required", 400);
      }

      const userBadges = await UserBadgeRepository.findByUserIdWithRank(parseInt(userId));

      const badgesData = userBadges.map((badge) => {
        const rank = badge.rank;
        let rank_display = "Participant";

        if (rank) {
          if (rank === 1) {
            rank_display = "Winner";
          } else if (rank === 2) {
            rank_display = "2nd Place";
          } else if (rank === 3) {
            rank_display = "3rd Place";
          } else {
            rank_display = `${rank}th Place`;
          }
        }

        return {
          id: badge.id,
          challenge_id: badge.challenge_id,
          challenge_title: badge.challenge?.title || "Challenge",
          badge_img: badge.badge_img,
          earned_at: badge.awarded_at || badge.created_at,
          admin_note: badge.admin_note,
          rank: rank || null,
          rank_display: rank_display,
        };
      });

      const summary = {
        total_badges: badgesData.length,
        recent_badges: badgesData.slice(-5), // Last 5 earned badges
      };

      res.json({
        success: true,
        data: {
          summary: summary,
          badges: badgesData,
        },
      });
    } catch (error) {
      logger.error(`Error getting user badges: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  } // GET /gamification/profile/badges/:userId - Get user badges for profile page
  static async getProfileBadges(req, res) {
    try {
      const { userId } = req.params;

      if (!userId || isNaN(userId)) {
        throw new customError("Valid user ID required", 400);
      }

      const userBadges = await UserBadgeRepository.findByUserIdWithRank(parseInt(userId));

      // Format badges data with detailed information
      const badgesData = userBadges.map((badge) => {
        const rank = badge.rank;
        let rank_display = "Participant";

        if (rank) {
          if (rank === 1) {
            rank_display = "Winner";
          } else if (rank === 2) {
            rank_display = "2nd Place";
          } else if (rank === 3) {
            rank_display = "3rd Place";
          } else {
            rank_display = `${rank}th Place`;
          }
        }

        return {
          id: badge.id,
          challenge_id: badge.challenge_id,
          challenge_title: badge.challenge?.title || "Challenge",
          badge_img: badge.badge_img,
          earned_at: badge.awarded_at || badge.created_at,
          admin_note: badge.admin_note,
          rank: rank || null,
          rank_display: rank_display,
        };
      });

      // Sort by earned date (newest first)
      badgesData.sort((a, b) => new Date(b.earned_at) - new Date(a.earned_at));

      res.json({
        success: true,
        data: {
          user_id: parseInt(userId),
          total_badges: badgesData.length,
          badges: badgesData,
        },
      });
    } catch (error) {
      logger.error(`Error getting profile badges: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /gamification/profile/challenges/:userId - Get user challenge participation for profile page
  static async getProfileChallenges(req, res) {
    try {
      const { userId } = req.params;
      const { status = "all" } = req.query; // all, won, participated, active

      if (!userId || isNaN(userId)) {
        throw new customError("Valid user ID required", 400);
      }

      // Get user's challenge participations and wins
      const [userChallengeParticipations, userWins] = await Promise.all([ChallengeService.getUserChallengeParticipations(parseInt(userId)), ChallengeWinnerService.getUserWins(parseInt(userId))]);

      // Create a map of wins for quick lookup
      const winsMap = new Map();
      userWins.forEach((win) => {
        winsMap.set(win.challenge_id, win);
      });

      // Format challenge data
      let challengesData = userChallengeParticipations.map((participation) => {
        const win = winsMap.get(participation.challenge_id);
        const isWinner = !!win;
        const now = new Date();
        const deadline = new Date(participation.deadline);
        const isActive = !participation.is_closed && deadline > now;
        const isCompleted = participation.is_closed || deadline <= now;

        return {
          id: participation.challenge_id,
          title: participation.title,
          description: participation.description,
          badge_img: participation.badge_img,
          deadline: participation.deadline,
          is_closed: participation.is_closed,
          status: isWinner ? "won" : isActive ? "active" : "participated",
          participation_date: participation.created_at,
          post_id: participation.post_id,
          win_info: isWinner
            ? {
                rank: win.rank,
                rank_display: win.rank === 1 ? "Winner" : win.rank === 2 ? "2nd Place" : win.rank === 3 ? "3rd Place" : `${win.rank}th Place`,
                final_score: win.final_score,
                admin_note: win.admin_note,
                selected_at: win.selected_at,
              }
            : null,
        };
      });

      // Filter based on status
      if (status !== "all") {
        challengesData = challengesData.filter((challenge) => challenge.status === status);
      }

      // Sort by participation date (newest first)
      challengesData.sort((a, b) => new Date(b.participation_date) - new Date(a.participation_date));

      // Calculate statistics
      const stats = {
        total_participated: userChallengeParticipations.length,
        total_won: userWins.length,
        active_participations: challengesData.filter((c) => c.status === "active").length,
        win_rate: userChallengeParticipations.length > 0 ? Math.round((userWins.length / userChallengeParticipations.length) * 100) : 0,
      };

      res.json({
        success: true,
        data: {
          user_id: parseInt(userId),
          stats: stats,
          challenges: challengesData,
        },
      });
    } catch (error) {
      logger.error(`Error getting profile challenges: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // GET /gamification/leaderboard - Get leaderboard data
  static async getLeaderboard(req, res) {
    try {
      const { type = "level", limit = 10 } = req.query;

      // For now, this is a placeholder. You would need to implement
      // leaderboard logic based on your requirements
      const leaderboardData = [];

      res.json({
        success: true,
        data: {
          type: type,
          leaderboard: leaderboardData,
        },
      });
    } catch (error) {
      logger.error(`Error getting leaderboard: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
}

module.exports = GamificationController;
