const UserExpService = require("./UserExpService");
const AchievementService = require("./AchievementService");
const NotificationService = require("./NotificationService");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");

// REVISI ANTI-SPAM: Hanya event yang melibatkan interaksi dengan akun lain yang memberikan EXP
// Ini mencegah user spam aktivitas sendiri untuk farming EXP
const expGainByEvent = {
  // === EVENT YANG MEMBERIKAN EXP (Interaksi dengan akun lain) ===

  // User mendapat interaksi dari orang lain (PASSIVE REWARDS - tidak bisa di-spam)
  userGotFollowed: 25, // Dapat follower baru dari orang lain
  userGotUnfollowed: -25, // Kehilangan follower
  postGotCommented: 15, // Post mendapat komentar dari orang lain
  postGotUncommented: -15, // Komentar dihapus dari post
  postGotLiked: 10, // Post mendapat like dari orang lain
  postGotUnliked: -10, // Like dihapus dari post
  postGotBookmarked: 20, // Post dibookmark orang lain
  postGotUnbookmarked: -20, // Bookmark dihapus dari post
  commentGotReplied: 8, // Komentar user dibalas orang lain
  commentGotUnreplied: -8, // Reply dihapus dari komentar user

  // User berinteraksi dengan konten berkualitas (LIMITED REWARDS untuk mencegah spam)
  postCreated: 50, // Membuat post baru (daily limit akan diterapkan)
  postDeleted: -50, // Menghapus post

  // === EVENT YANG TIDAK MEMBERIKAN EXP (Dihapus untuk mencegah spam) ===
  // userFollowed: 0,            // Follow orang lain - DIHAPUS (bisa di-spam)
  // userUnfollowed: 0,          // Unfollow orang lain - DIHAPUS (bisa di-spam)
  // commentOnPost: 0,           // Komentar di post orang lain - DIHAPUS (bisa di-spam)
  // commentOnPostDeleted: 0,    // Hapus komentar - DIHAPUS (bisa di-spam)
  // replyOnComment: 0,          // Reply komentar - DIHAPUS (bisa di-spam)
  // replyOnCommentDeleted: 0,   // Hapus reply - DIHAPUS (bisa di-spam)
  // likeOnPost: 0,              // Like post orang lain - DIHAPUS (sangat mudah di-spam)
  // likeOnPostDeleted: 0,       // Unlike post - DIHAPUS (sangat mudah di-spam)

  // Menembalikan event yang tidak memberikan EXP
  userFollowed: 5,
  userUnfollowed: -5,
  commentOnPost: 2,
  commentOnPostDeleted: -2,
  replyOnComment: 1,
  replyOnCommentDeleted: -1,
  likeOnPost: 3, // DIHAPUS: Tidak memberikan EXP karena mudah di-spam
  likeOnPostDeleted: 3, // DIHAPUS: Tidak memberikan EXP karena mudah di-spam

  // === FUTURE: Challenge Events (High Reward, Limited Participation) ===
  challengeWinner: 5000, // Menang challenge (rare reward)
  challengeParticipant: 500, // Participant yang menyelesaikan challenge
};

// LEVEL SYSTEM: Extended to Level 100 with exponential growth
// Mencegah user mencapai level tinggi terlalu mudah
const levelThresholds = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1350,
  8: 1750,
  9: 2200,
  10: 2700,
  11: 3250,
  12: 3850,
  13: 4500,
  14: 5200,
  15: 5950,
  16: 6750,
  17: 7600,
  18: 8500,
  19: 9450,
  20: 10450,
  21: 11500,
  22: 12600,
  23: 13750,
  24: 14950,
  25: 16200,
  26: 17500,
  27: 18850,
  28: 20250,
  29: 21700,
  30: 23200,
  31: 24750,
  32: 26350,
  33: 28000,
  34: 29700,
  35: 31450,
  36: 33250,
  37: 35100,
  38: 37000,
  39: 38950,
  40: 40950,
  41: 43000,
  42: 45100,
  43: 47250,
  44: 49450,
  45: 51700,
  46: 54000,
  47: 56350,
  48: 58750,
  49: 61200,
  50: 63700,
  51: 66250,
  52: 68850,
  53: 71500,
  54: 74200,
  55: 76950,
  56: 79750,
  57: 82600,
  58: 85500,
  59: 88450,
  60: 91450,
  61: 94500,
  62: 97600,
  63: 100750,
  64: 103950,
  65: 107200,
  66: 110500,
  67: 113850,
  68: 117250,
  69: 120700,
  70: 124200,
  71: 127750,
  72: 131350,
  73: 135000,
  74: 138700,
  75: 142450,
  76: 146250,
  77: 150100,
  78: 154000,
  79: 157950,
  80: 161950,
  81: 166000,
  82: 170100,
  83: 174250,
  84: 178450,
  85: 182700,
  86: 187000,
  87: 191350,
  88: 195750,
  89: 200200,
  90: 204700,
  91: 209250,
  92: 213850,
  93: 218500,
  94: 223200,
  95: 227950,
  96: 232750,
  97: 237600,
  98: 242500,
  99: 247450,
  100: 252450, // MAX LEVEL
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
      // REVISI: Hanya event yang memberikan EXP yang akan trigger achievement
      // Map eventType to achievement event names (hanya untuk event yang valid)
      const eventMap = {
        // Passive rewards (user mendapat interaksi)
        userGotFollowed: "user_followed",
        userGotUnfollowed: "user_followed", // reverse
        postGotCommented: "post_commented",
        postGotUncommented: "post_commented", // reverse
        postGotLiked: "post_liked",
        postGotUnliked: "post_liked", // reverse
        postGotBookmarked: "post_bookmarked",
        postGotUnbookmarked: "post_bookmarked", // reverse
        commentGotReplied: "comment_replied",
        commentGotUnreplied: "comment_replied", // reverse

        // Content creation (limited)
        postCreated: "post_uploaded",
        postDeleted: "post_uploaded", // reverse

        // User interactions (passive)
        userFollowed: "user_followed",
        userUnfollowed: "user_followed", // reverse
        commentOnPost: "post_commented",
        commentOnPostDeleted: "post_commented", // reverse
        replyOnComment: "comment_replied",
        replyOnCommentDeleted: "comment_replied", // reverse
        likeOnPost: "post_liked",
        likeOnPostDeleted: "post_liked", // reverse

        // Challenge events (future)
        challengeWinner: "challenge_winner",
        challengeParticipant: "challenge_participant",
      };

      const achievementEvent = eventMap[eventType];
      if (achievementEvent) {
        await AchievementService.handleEvent(achievementEvent, userId, {});
      } else {
        console.log(`No achievement mapping for event: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error updating achievement for user ${userId}:`, error);
    }
  }

  static async updateUserExpAndLevel(userId, eventType) {
    const deltaExp = expGainByEvent[eventType] || 0;

    // ANTI-SPAM: Skip jika event tidak memberikan EXP
    if (deltaExp === 0) {
      console.log(`Event ${eventType} does not grant EXP - skipping update for user ${userId}`);
      return;
    }

    const user = await UserExpService.getUserExpByUserId(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    let { exp: currentExp, level: currentLevel } = user;
    currentExp = parseInt(currentExp, 10) || 0; // Konversi ke integer, jika gagal jadi 0
    currentLevel = parseInt(currentLevel, 10) || 1; // Konversi level, jika gagal jadi 1

    // LEVEL CAP: Mencegah user melebihi level 100
    if (currentLevel >= 100 && deltaExp > 0) {
      console.log(`User ${userId} already at max level (100) - no EXP gain allowed`);
      return;
    }

    const newExp = Math.max(0, currentExp + deltaExp);
    let newLevel = currentLevel;

    // Hitung level baru berdasarkan EXP
    Object.entries(levelThresholds)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([lvl, threshold]) => {
        if (newExp >= threshold && Number(lvl) <= 100) {
          // Level cap 100
          newLevel = Number(lvl);
        }
      });

    // Current threshold for the current level
    const currentTreshold = levelThresholds[newLevel] || 0;
    // Next threshold for the current level (cap at level 100)
    const nextTreshold = newLevel >= 100 ? levelThresholds[100] : levelThresholds[newLevel + 1] || levelThresholds[100];

    await UserExpService.updateUserExpByUserId(userId, newExp, newLevel, currentTreshold, nextTreshold);

    // Send level up notification if level increased
    if (newLevel > currentLevel) {
      try {
        await NotificationService.notifyLevelUp(userId, newLevel, deltaExp);
        console.log(`🎉 User ${userId} leveled up to ${newLevel}!`);
      } catch (notificationError) {
        console.error("Failed to send level up notification:", notificationError);
      }
    }

    // Send EXP gained notification for significant gains (threshold dinaikkan)
    if (deltaExp > 0 && deltaExp >= 20) {
      // Dinaikkan dari 10 ke 20
      try {
        const reason = this.getExpGainReason(eventType);
        await NotificationService.notifyExpGained(userId, deltaExp, reason);
      } catch (notificationError) {
        console.error("Failed to send exp gain notification:", notificationError);
      }
    }

    console.log(`💎 User ${userId}: EXP ${currentExp} -> ${newExp} (${deltaExp >= 0 ? "+" : ""}${deltaExp}), Level ${currentLevel} -> ${newLevel} (Next: ${nextTreshold})`);
  }

  static getExpGainReason(eventType) {
    const reasonMap = {
      userGotFollowed: "Gained a new follower",
      userGotUnfollowed: "Lost a follower",
      postGotCommented: "Your post received a comment",
      postGotUncommented: "A comment on your post was removed",
      postGotLiked: "Your post received a like",
      postGotUnliked: "A like on your post was removed",
      postGotBookmarked: "Your post was bookmarked",
      postGotUnbookmarked: "A bookmark on your post was removed",
      commentGotReplied: "Your comment received a reply",
      commentGotUnreplied: "A reply to your comment was removed",
      postCreated: "Created a new post",
      postDeleted: "Deleted a post",
      userFollowed: "Followed a user",
      userUnfollowed: "Unfollowed a user",
      commentOnPost: "Commented on a post",
      commentOnPostDeleted: "Deleted a comment on a post",
      replyOnComment: "Replied to a comment",
      replyOnCommentDeleted: "Deleted a reply to a comment",
      likeOnPost: "Liked a post",
      likeOnPostDeleted: "Removed a like from a post",
      challengeWinner: "Won a challenge",
      challengeParticipant: "Participated in a challenge",
    };
    return reasonMap[eventType] || "Community interaction";
  }

  // ANTI-SPAM: Method untuk cek daily limits (implementasi future)
  static async checkDailyLimits(userId, eventType) {
    // TODO: Implementasi daily limits untuk event tertentu
    // Contoh: maksimal 10 post per hari yang memberikan EXP
    // Ini akan mencegah spam posting untuk farming EXP
    return true; // Placeholder
  }
}

module.exports = { GamificationService };
