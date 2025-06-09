const jwt = require("jsonwebtoken");
const logger = require("../utils/winstonLogger");
const UserRepository = require("../repositories/UserRepository");

const verifyAdminRole = async (req, res, next) => {
  const token = req.cookies.accessToken; // Access the token from the cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verifikasi token akses
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Get user role from the database
    const userFromDb = await UserRepository.findById(user.id);
    if (!userFromDb) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has admin role
    if (userFromDb.role !== "admin") {
      logger.warn(`Unauthorized access attempt by user: ${user.id}`);
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    return next(); // Jika token valid dan user adalah admin, lanjutkan ke middleware berikutnya
  } catch (err) {
    logger.error(`Error: ${err.message}`, {
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyAdminRole };
