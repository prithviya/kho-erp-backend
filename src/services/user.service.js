const bcrypt = require("bcrypt");
const { sequelize, User, Role } = require("../model");
const repository = require("../repository/user.repository");
const logger = require("../helpers/logger");

const createUser = async (data) => {
  logger.info(`Creating user: ${data.email}`);

  const existingEmail = await repository.findByEmail(data.email);
  if (existingEmail) {
    logger.warn(`User creation failed for email: ${data.email}`);
    throw new Error("Email already exists.");
  }

  const existingUsername = await repository.findByUsername(data.username);
  if (existingUsername) {
    logger.warn(`User creation failed for username: ${data.username}`);
    throw new Error("Username already exists.");
  }

  const roles = await Role.findAll({ where: { id: data.roleIds || [] } });
  if (roles.length !== (data.roleIds || []).length) {
    throw new Error("One or more roles are invalid.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email,
      username: data.username,
      phone: data.phone || null,
      employeeRecord: data.employeeRecord || null,
      password: hashedPassword,
      isActive: typeof data.isActive === "boolean" ? data.isActive : true
    }, { transaction });

    await user.setRoles(data.roleIds, { transaction });

    await transaction.commit();
    logger.info(`User created successfully: ${data.email}`);
    return await repository.getUserWithRoles(user.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateUser = async (id, data) => {
  logger.info(`Updating user with ID: ${id}`);

  const user = await User.findByPk(id, { paranoid: false });
  if (!user) throw new Error("User not found.");

  const existingEmail = await repository.findByEmail(data.email, id);
  if (existingEmail) {
    throw new Error("Email already exists.");
  }

  const existingUsername = await repository.findByUsername(data.username, id);
  if (existingUsername) {
    throw new Error("Username already exists.");
  }

  const roles = await Role.findAll({ where: { id: data.roleIds || [] } });
  if (roles.length !== (data.roleIds || []).length) {
    throw new Error("One or more roles are invalid.");
  }

  const transaction = await sequelize.transaction();
  try {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email,
      username: data.username,
      phone: data.phone || null,
      employeeRecord: data.employeeRecord || null,
      isActive: typeof data.isActive === "boolean" ? data.isActive : user.isActive
    };

    if (data.password && String(data.password).trim()) {
      payload.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(payload, { transaction });
    await user.setRoles(data.roleIds, { transaction });

    await transaction.commit();
    return await repository.getUserWithRoles(id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get all users
const getUsers = () => {
  logger.info("Fetching all users.");
  return repository.getUsers();
};

const updateUserStatus = async (id, isActive) => {
  const user = await User.findByPk(id, { paranoid: false });
  if (!user) throw new Error("User not found.");
  return await repository.updateStatus(id, isActive);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id, { paranoid: false });
  if (!user) throw new Error("User not found.");

  const transaction = await sequelize.transaction();
  try {
    await user.update({ isActive: false }, { transaction });
    await user.destroy({ transaction });
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  updateUserStatus,
  deleteUser
};