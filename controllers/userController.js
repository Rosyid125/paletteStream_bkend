const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.query();
  res.json(users);
};

const createUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body; // Destructure the email, password, first_name, and last_name from the request body
  const role = "user"; // Set the role to user
  const user = await User.query().insert({ email, password, first_name, last_name, role }); // Insert the user into the database
  res.json(user); // Return the user
};

const createAdmin = async (req, res) => {
  const { email, password, first_name, last_name } = req.body; // Destructure the email, password, first_name, and last_name from the request body
  const role = "admin"; // Set the role to admin
  const user = await User.query().insert({ email, password, first_name, last_name, role }); // Insert the user into the database
  res.json(user); // Return the user
};

// Export the getUsers, createUser, and createAdmin functions
module.exports = {
  getUsers,
  createUser,
  createAdmin,
};
