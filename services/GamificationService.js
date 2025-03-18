const MyEmitter = require("events");
const myEmitter = new MyEmitter();

// Handler for the "postCreated" event
myEmitter.on("postCreated", async (userId) => {
  // Consequences for postCreated
  await GamificationService.updateUserAchievement(userId, "postCreated");
  await GamificationService.updateUserExp(userId, "postCreated");
});

// Handler for the "postDeleted" event
myEmitter.on("postDeleted", async (userId) => {
  // Consequences for postDeleted
  await GamificationService.updateUserAchievement(userId, "postDeleted");
  await GamificationService.updateUserExp(userId, "postDeleted");
});

// Handler for the "userFollowed" event
myEmitter.on("userFollowed", async (userId) => {
  // Consequences for userFollowed
  await GamificationService.updateUserAchievement(userId, "userFollowed");
  await GamificationService.updateUserExp(userId, "userFollowed");
});

// Handler for the "userUnfollowed" event
myEmitter.on("userUnfollowed", async (userId) => {
  // Consequences for userUnfollowed
  await GamificationService.updateUserAchievement(userId, "userUnfollowed");
  await GamificationService.updateUserExp(userId, "userUnfollowed");
});

// Handler for the "challengeJoined" event
myEmitter.on("challengeJoined", async (userId) => {
  // Consequences for challengeJoined
  await GamificationService.updateUserAchievement(userId, "challengeJoined");
  await GamificationService.updateUserExp(userId, "challengeJoined");
});

// Handler for the "challengeLeft" event
myEmitter.on("challengeLeft", async (userId) => {
  // Consequences for challengeLeft
  await GamificationService.updateUserAchievement(userId, "challengeLeft");
  await GamificationService.updateUserExp(userId, "challengeLeft");
});

// Handler for the "challengeWinner" event
myEmitter.on("challengeWinner", async (userId) => {
  // Consequences for challengeWinner
  await GamificationService.updateUserAchievement(userId, "challengeWinner");
  await GamificationService.updateUserExp(userId, "challengeWinner");
});

class GamificationService {
  static async updateUserAchievement(userId, eventType) {
    // Update achievement according to eventType
    console.log(`Updating achievement for user ${userId} due to ${eventType}`);
    // Implement logic according to eventType
  }

  static async updateUserExp(userId, eventType) {
    // Update exp according to eventType
    console.log(`Updating EXP for user ${userId} due to ${eventType}`);
    // Implement logic according to eventType
  }
}

module.exports = GamificationService;
