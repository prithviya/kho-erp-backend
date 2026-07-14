const service = require("../services/user.service");
const {
  createUserValidation,
} = require("../validation/user.validation");

const createUser = async (req, res) => {
  try {
    const { error } = createUserValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await service.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await service.getUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
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