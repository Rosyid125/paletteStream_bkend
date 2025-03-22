const jwt = require("jsonwebtoken");
const AuthService = require("../services/AuthService");
const logger = require("../utils/winstonLogger");

const verifyAccessToken = async (req, res, next) => {
  const token = req.cookies.accessToken; // Access the token from the cookies
  const oldRefreshToken = req.cookies.refreshToken; // Access the refresh token from the cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verifikasi token akses
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = user;
    return next(); // Jika token valid, lanjutkan ke middleware berikutnya
  } catch (err) {
    // Jika token akses tidak valid, verifikasi refresh token
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
      // Create a new access token using the refresh token
      const { accessToken, refreshToken } = await AuthService.refreshToken(oldRefreshToken);

      // Perbarui cookie dengan token baru
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      req.user = user;
      return next(); // Token baru berhasil diberikan, lanjutkan ke middleware berikutnya
    } catch (refreshError) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${refreshError.message}`, {
        stack: refreshError.stack,
        timestamp: new Date().toISOString(),
      });

      return res.status(403).json({ message: "Invalid or expired token" });
    }
  }
};

module.exports = { verifyAccessToken };
