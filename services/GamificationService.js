const UserExpService = require("./UserExpService");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");

const expGainByEvent = {
  postCreated: 20,
  postDeleted: -20,
  userFollowed: 5,
  userUnfollowed: -5,
  userGotFollowed: 20,
  userGotUnfollowed: -20,
  commentOnPost: 3,
  commentOnPostDeleted: -3,
  likeOnPost: 1,
  likeOnPostDeleted: -1,
  postGotBookmarked: 10,
  postGotUnbookmarked: -10,
  postGotLiked: 5,
  postGotUnliked: -5,
  // challengeJoined: 50,
  // challengeLeft: -50,
  // challengeWinner: 1000,
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
