const { User } = require("../model");

const createUser = (data) => User.create(data);

const findByEmail = (email) =>
  User.findOne({
    where: { email },
  });

const findByUsername = (username) =>
  User.findOne({
    where: { username },
  });

const getAllUsers = () =>
  User.findAll({
    attributes: {
      exclude: ["password"],
    },
  });

module.exports = {
  createUser,
  findByEmail,
  findByUsername,
  getAllUsers,
};