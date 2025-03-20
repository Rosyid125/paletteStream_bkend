const winston = require("winston");

// Setup logger menggunakan winston
const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: "logs/error.log", level: "error" })],
});

module.exports = logger;
