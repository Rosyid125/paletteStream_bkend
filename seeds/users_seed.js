const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Ensure the users table is cleared before seeding
  await knex("users").del();

  // Define the password to hash
  const passwordAdmin = "adminpassword";
  const passwordUser = "userpassword";

  // Hash the passwords using bcrypt
  const hashedAdminPassword = await bcrypt.hash(passwordAdmin, 10);
  const hashedUserPassword = await bcrypt.hash(passwordUser, 10);

  // Insert two users with hashed passwords
  await knex("users").insert([
    {
      email: "admin@example.com",
      password: hashedAdminPassword,
      first_name: "Admin",
      last_name: "User",
      role: "admin",
      is_active: true,
    },
    {
      email: "user@example.com",
      password: hashedUserPassword,
      first_name: "Regular",
      last_name: "User",
      role: "default",
      is_active: true,
    },
  ]);
};
