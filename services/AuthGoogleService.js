// Service untuk login Google OAuth2
const { OAuth2Client } = require("google-auth-library");
const UserRepository = require("../repositories/UserRepository");
const customError = require("../errors/customError");
const jwt = require("jsonwebtoken");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

class AuthGoogleService {
  static getAuthUrl() {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
      prompt: "select_account",
    });
    return url;
  }

  static async handleCallback(code) {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    // Ambil info user dari Google
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    // Cari user, jika belum ada, buat user baru
    let user = await UserRepository.getUserByEmail(email);
    if (!user) {
      user = await UserRepository.create(email, null, payload.given_name || "", payload.family_name || "", "default");
    }
    // Generate JWT
    const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return { accessToken, user };
  }
}

module.exports = AuthGoogleService;
