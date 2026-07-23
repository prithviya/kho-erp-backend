const service = require("../services/user.service");
const { createUserValidation, } = require("../validation/user.validation");
const logger = require("../helpers/logger");

const createUser = async (req, res) => {

  logger.info("Creating user.");
  try {
    const { error } = createUserValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await service.createUser(req.body);
    logger.info(`User created: ${user.name}`);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  logger.info("Fetching all users.");
  try {
    const users = await service.getUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
};