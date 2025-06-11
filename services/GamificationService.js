const UserExpService = require("./UserExpService");
const AchievementService = require("./AchievementService");
const NotificationService = require("./NotificationService");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");

const expGainByEvent = {
  postCreated: 40, // sudah
  postDeleted: -40, // sudah
  userFollowed: 5, // sudah
  userUnfollowed: -5, // sudah
  userGotFollowed: 20, // sudah
  userGotUnfollowed: -20, // sudah
  commentOnPost: 2, // sudah
  commentOnPostDeleted: -2, // sudah
  postGotCommented: 5, // sudah
  postGotUncommented: -5, // sudah
  replyOnComment: 1, // sudah
  replyOnCommentDeleted: -1, // sudah
  commentGotReplied: 3, // sudah
  commentGotUnreplied: -3, // sudah
  likeOnPost: 3, // sudah
  likeOnPostDeleted: -3, // sudah
  postGotLiked: 8, // sudah
  postGotUnliked: -8, // sudah
  postGotBookmarked: 10, // sudah
  postGotUnbookmarked: -10, // sudah
  // challengeJoined: 100,
  // challengeLeft: -100,
  // challengeWinner: 5000,
};

const levelThresholds = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 4000,
  8: 8000,
  9: 16000,
  10: 32000,
};

// Daftarkan listener untuk setiap eventType
Object.keys(expGainByEvent).forEach((eventType) => {
  gamificationEmitter.on(eventType, async (userId) => {
    try {
      await GamificationService.updateUserAchievement(userId, eventType);
      await GamificationService.updateUserExpAndLevel(userId, eventType);
    } catch (error) {
      console.error(`Error handling ${eventType} for user ${userId}:`, error);
    }
  });
});

// Daftarkan listener untuk achievement events dengan metadata
const achievementEvents = ["post_liked", "post_commented", "comment_replied", "post_bookmarked", "user_followed", "chat_started", "comment_replied_by_user", "leaderboard_daily", "leaderboard_weekly", "post_tagged", "post_uploaded"];

achievementEvents.forEach((eventName) => {
  gamificationEmitter.on(`achievement:${eventName}`, async ({ userId, metadata }) => {
    try {
      await AchievementService.handleEvent(eventName, userId, metadata);
    } catch (error) {
      console.error(`Error handling achievement ${eventName} for user ${userId}:`, error);
    }
  });
});

class GamificationService {
  static async updateUserAchievement(userId, eventType) {
    console.log(`Updating achievement for user ${userId} due to ${eventType}`);
    try {
      // Map eventType to achievement event names
      const eventMap = {
        postCreated: "post_uploaded",
        postDeleted: "post_uploaded", // reverse
        userFollowed: "user_followed",
        userUnfollowed: "user_followed", // reverse
        userGotFollowed: "user_followed",
        userGotUnfollowed: "user_followed", // reverse
        commentOnPost: "post_commented",
        commentOnPostDeleted: "post_commented", // reverse
        postGotCommented: "post_commented",
        postGotUncommented: "post_commented", // reverse
        replyOnComment: "comment_replied_by_user",
        replyOnCommentDeleted: "comment_replied_by_user", // reverse
        commentGotReplied: "comment_replied",
        commentGotUnreplied: "comment_replied", // reverse
        likeOnPost: "post_liked",
        likeOnPostDeleted: "post_liked", // reverse
        postGotLiked: "post_liked",
        postGotUnliked: "post_liked", // reverse
        postGotBookmarked: "post_bookmarked",
        postGotUnbookmarked: "post_bookmarked", // reverse
      };

      const achievementEvent = eventMap[eventType];
      if (achievementEvent) {
        await AchievementService.handleEvent(achievementEvent, userId, {});
      }
    } catch (error) {
      console.error(`Error updating achievement for user ${userId}:`, error);
    }
  }

  static async updateUserExpAndLevel(userId, eventType) {
    const deltaExp = expGainByEvent[eventType] || 0;

    const user = await UserExpService.getUserExpByUserId(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    let { exp: currentExp, level: currentLevel } = user;
    currentExp = parseInt(currentExp, 10) || 0; // Konversi ke integer, jika gagal jadi 0
    currentLevel = parseInt(currentLevel, 10) || 1; // Konversi level, jika gagal jadi 1
    const newExp = Math.max(0, currentExp + deltaExp);
    let newLevel = currentLevel;

    Object.entries(levelThresholds)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([lvl, threshold]) => {
        if (newExp >= threshold) {
          newLevel = Number(lvl);
        }
      });

    // Curent treshold for the current level
    const currentTreshold = levelThresholds[newLevel] || 0;
    // Next threshold for the current level
    const nextTreshold = levelThresholds[newLevel + 1] || Infinity;

    await UserExpService.updateUserExpByUserId(userId, newExp, newLevel, currentTreshold, nextTreshold);

    // Send level up notification if level increased
    if (newLevel > currentLevel) {
      try {
        await NotificationService.notifyLevelUp(userId, newLevel, deltaExp);
      } catch (notificationError) {
        console.error("Failed to send level up notification:", notificationError);
      }
    }

    // Send EXP gained notification for significant gains
    if (deltaExp > 0 && deltaExp >= 10) {
      try {
        const reason = this.getExpGainReason(eventType);
        await NotificationService.notifyExpGained(userId, deltaExp, reason);
      } catch (notificationError) {
        console.error("Failed to send exp gain notification:", notificationError);
      }
    }

    console.log(`User ${userId}: EXP ${currentExp} -> ${newExp}, Level ${currentLevel} -> ${newLevel} (Treshold: ${nextTreshold})`);
  }

  static getExpGainReason(eventType) {
    const reasonMap = {
      postCreated: "Creating a post",
      userGotFollowed: "Getting a new follower",
      postGotLiked: "Post received a like",
      postGotCommented: "Post received a comment",
      postGotBookmarked: "Post was bookmarked",
      commentOnPost: "Commenting on a post",
      replyOnComment: "Liking a post",
      likeOnPost: "Liking a post",
      userFollowed: "Following a user",
    };
    return reasonMap[eventType] || "User activity";
  }
}

module.exports = { GamificationService };
