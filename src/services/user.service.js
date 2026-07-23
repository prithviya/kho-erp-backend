const bcrypt = require("bcrypt");
const repository = require("../repository/user.repository");
const logger = require("../helpers/logger");

const createUser = async (data) => {
  logger.info(`Creating user: ${data.username}`);
  const email = await repository.findByEmail(data.email);

  if (email) {
    logger.warn(`User creation failed for email: ${data.email}`);
    throw new Error("Email already exists");
  }

  const username = await repository.findByUsername(data.username);

  if (username) {
    logger.warn(`User creation failed for username: ${data.username}`);
    throw new Error("Username already exists");
  }

  data.password = await bcrypt.hash(data.password, 10);
  logger.info(`User created successfully: ${data.username}`);
  return repository.createUser(data);
};

// Get all users
const getUsers = () => {
  logger.info("Fetching all users.");
  return repository.getAllUsers();
};

module.exports = {
  createUser,
  getUsers,
};