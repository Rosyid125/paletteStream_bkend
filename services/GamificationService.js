const MyEmitter = require("events");
const myEmitter = new MyEmitter();

// Handler for the "postCreated" event
myEmitter.on("postCreated", async (userId) => {
  try {
    // Consequences for postCreated
    await GamificationService.updateUserAchievement(userId, "postCreated");
    await GamificationService.updateUserExp(userId, "postCreated");
  } catch (error) {
    throw error;
  }
});

// Handler for the "postDeleted" event
myEmitter.on("postDeleted", async (userId) => {
  try {
    // Consequences for postDeleted
    await GamificationService.updateUserAchievement(userId, "postDeleted");
    await GamificationService.updateUserExp(userId, "postDeleted");
  } catch (error) {
    throw error;
  }
});

// Handler for the "userFollowed" event
myEmitter.on("userFollowed", async (userId) => {
  try {
    // Consequences for userFollowed
    await GamificationService.updateUserAchievement(userId, "userFollowed");
    await GamificationService.updateUserExp(userId, "userFollowed");
  } catch (error) {
    throw error;
  }
});

// Handler for the "userUnfollowed" event
myEmitter.on("userUnfollowed", async (userId) => {
  try {
    // Consequences for userUnfollowed
    await GamificationService.updateUserAchievement(userId, "userUnfollowed");
    await GamificationService.updateUserExp(userId, "userUnfollowed");
  } catch (error) {
    throw error;
  }
});

// Handler for the "challengeJoined" event
myEmitter.on("challengeJoined", async (userId) => {
  try {
    // Consequences for challengeJoined
    await GamificationService.updateUserAchievement(userId, "challengeJoined");
    await GamificationService.updateUserExp(userId, "challengeJoined");
  } catch (error) {
    throw error;
  }
});

// Handler for the "challengeLeft" event
myEmitter.on("challengeLeft", async (userId) => {
  try {
    // Consequences for challengeLeft
    await GamificationService.updateUserAchievement(userId, "challengeLeft");
    await GamificationService.updateUserExp(userId, "challengeLeft");
  } catch (error) {
    throw error;
  }
});

// Handler for the "challengeWinner" event
myEmitter.on("challengeWinner", async (userId) => {
  try {
    // Consequences for challengeWinner
    await GamificationService.updateUserAchievement(userId, "challengeWinner");
    await GamificationService.updateUserExp(userId, "challengeWinner");
  } catch (error) {
    throw error;
  }
});

class GamificationService {
  static async updateUserAchievement(userId, eventType) {
    try {
      // Update achievement according to eventType
      console.log(`Updating achievement for user ${userId} due to ${eventType}`);
      // Implement logic according to eventType
    } catch (error) {
      throw error;
    }
  }

  static async updateUserExp(userId, eventType) {
    try {
      // Update exp according to eventType
      console.log(`Updating EXP for user ${userId} due to ${eventType}`);
      // Implement logic according to eventType
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GamificationService;
