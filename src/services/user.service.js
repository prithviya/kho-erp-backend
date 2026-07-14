const bcrypt = require("bcrypt");
const repository = require("../repository/user.repository");

const createUser = async (data) => {
  const email = await repository.findByEmail(data.email);

  if (email) throw new Error("Email already exists");

  const username = await repository.findByUsername(data.username);

  if (username) throw new Error("Username already exists");

  data.password = await bcrypt.hash(data.password, 10);

  return repository.createUser(data);
};

const getUsers = () => repository.getAllUsers();

module.exports = {
  createUser,
  getUsers,
};