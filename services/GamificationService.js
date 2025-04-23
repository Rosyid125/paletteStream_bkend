const UserExpService = require("./UserExpService");
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

class GamificationService {
  static async updateUserAchievement(userId, eventType) {
    console.log(`Updating achievement for user ${userId} due to ${eventType}`);
    // TODO: Implement achievement logic here
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

    console.log(`User ${userId}: EXP ${currentExp} -> ${newExp}, Level ${currentLevel} -> ${newLevel} (Treshold: ${nextTreshold})`);
  }
}

module.exports = { GamificationService };
