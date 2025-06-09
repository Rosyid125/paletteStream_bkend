const bcrypt = require("bcryptjs");
// import from environment variables
const DEFAULT_USER_USERNAME = process.env.DEFAULT_USER_USERNAME || "player";
const DEFAULT_USER_AVATAR = process.env.DEFAULT_USER_AVATAR || "storage/avatars/noimage.png";
const DEFAULT_USER_BIO = process.env.DEFAULT_USER_BIO || "Hello, I'm new here!";
const DEFAULT_USER_LOCATION = process.env.DEFAULT_USER_LOCATION || "Earth";

exports.seed = async function (knex) {
  // Hapus data admin lama (opsional, hanya jika ingin clean)
  await knex("users").where({ role: "admin" }).del();

  // Data admin default
  const adminData = {
    email: "admin@palette.com",
    password: await bcrypt.hash("admin12345", 10),
    first_name: "Super",
    last_name: "Admin",
    role: "admin",
    is_active: true,
    status: "active",
    created_at: new Date(),
    updated_at: new Date(),
  };

  // Insert admin
  await knex("users").insert(adminData);

  // Get admin ID
  const [admin] = await knex("users").where({ email: adminData.email });
  const adminId = admin.id;

  // Default data
  const username = DEFAULT_USER_USERNAME;
  const avatar = DEFAULT_USER_AVATAR;
  const bio = DEFAULT_USER_BIO;
  const location = DEFAULT_USER_LOCATION;

  // Insert default profile
  await knex("user_profiles").insert({
    user_id: adminId,
    username: username,
    avatar: avatar,
    bio: bio,
    location: location,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Default data
  const exp = 0;
  const level = 1;

  // Insert default user stats
  await knex("user_exps").insert({
    user_id: adminId,
    exp: exp,
    level: level,
    created_at: new Date(),
    updated_at: new Date(),
  });
};
