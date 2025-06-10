const { EventEmitter } = require("events");

// Buat instance EventEmitter untuk gamifikasi
const gamificationEmitter = new EventEmitter();

// Enhanced event emitter for achievements with metadata
gamificationEmitter.emitAchievementEvent = function (eventName, userId, metadata = {}) {
  this.emit(`achievement:${eventName}`, { userId, metadata });
};

module.exports = { gamificationEmitter };
