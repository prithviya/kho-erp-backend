const service = require("../services/user.service");
const {
  createUserValidation,
  updateUserValidation,
  updateUserStatusValidation
} = require("../validation/user.validation");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");

const createUser = asyncHandler(async (req, res) => {
  logger.info("Creating user.");
  const { error } = createUserValidation.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, null, 400);
  }

  const user = await service.createUser(req.body);
  return ApiResponse.created(res, "User created successfully.", user);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await service.getUsers(req.query.search);
  return ApiResponse.success(res, "Users fetched successfully.", users);
});

const updateUser = asyncHandler(async (req, res) => {
  const { error } = updateUserValidation.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, null, 400);
  }

  const user = await service.updateUser(req.params.id, req.body);
  return ApiResponse.success(res, "User updated successfully.", user);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { error } = updateUserStatusValidation.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, null, 400);
  }

  const user = await service.updateUserStatus(req.params.id, req.body.isActive);
  return ApiResponse.success(res, "User status updated successfully.", user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await service.deleteUser(req.params.id);
  if (!deleted) {
    return ApiResponse.notFound(res, "User not found.");
  }
  return ApiResponse.success(res, "User deleted successfully.");
});

module.exports = {
  createUser,
  getUsers,
  updateUser,
  updateUserStatus,
  deleteUser
};