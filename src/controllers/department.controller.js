const service = require("../services/department.service");
const { createDepartmentValidation, updateDepartmentValidation } = require("../validation/department.validation");
const logger = require("../helpers/logger");

const createDepartment = async (req, res) => {
  logger.info("Creating department.");
  try {
    const { error } = createDepartmentValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const department = await service.createDepartment(req.body);
    logger.info(`Department created: ${department.departmentName}`);

    res.status(201).json({
      success: true,
      message: "Department Created Successfully",
      data: department,
    });
  } catch (err) {
    logger.error(`Error creating department: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  logger.info("Fetching all departments.");
  try {
    const departments = await service.getDepartments();

    res.json({
      success: true,
      data: departments,
    });
  } catch (err) {
    logger.error(`Error fetching departments: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  logger.info(`Fetching department with ID: ${req.params.id}`);
  try {
    const department = await service.getDepartmentById(req.params.id);

    res.json({
      success: true,
      data: department,
    });
  } catch (err) {
    logger.error(`Error fetching department: ${err.message}`);
    if (err.message === "Department not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getDepartmentByDepartId = async (req, res) => {
  logger.info(`Fetching department with departid: ${req.params.departid}`);
  try {
    const department = await service.getDepartmentByDepartId(req.params.departid);

    res.json({
      success: true,
      data: department,
    });
  } catch (err) {
    logger.error(`Error fetching department: ${err.message}`);
    if (err.message === "Department not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  logger.info(`Updating department with ID: ${req.params.id}`);
  try {
    const { error } = updateDepartmentValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const department = await service.updateDepartment(req.params.id, req.body);
    logger.info(`Department updated: ${department.departmentName}`);

    res.json({
      success: true,
      message: "Department Updated Successfully",
      data: department,
    });
  } catch (err) {
    logger.error(`Error updating department: ${err.message}`);
    if (err.message === "Department not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  logger.info(`Deleting department with ID: ${req.params.id}`);
  try {
    await service.deleteDepartment(req.params.id);
    logger.info(`Department deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Department Deleted Successfully",
    });
  } catch (err) {
    logger.error(`Error deleting department: ${err.message}`);
    if (err.message === "Department not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Cannot delete department")) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentByDepartId,
  updateDepartment,
  deleteDepartment,
};