const service = require("../services/employee.service");
const { createEmployeeValidation, updateEmployeeValidation } = require("../validation/employee.validation");
const logger = require("../helpers/logger");

const createEmployee = async (req, res) => {
  logger.info("Creating employee.");
  try {
    const { error } = createEmployeeValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const employee = await service.createEmployee(req.body);
    logger.info(`Employee created: ${employee.empName}`);

    res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
      data: employee,
    });
  } catch (err) {
    logger.error(`Error creating employee: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getEmployees = async (req, res) => {
  logger.info("Fetching all employees.");
  try {
    const employees = await service.getEmployees();

    res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    logger.error(`Error fetching employees: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  logger.info(`Fetching employee with ID: ${req.params.id}`);
  try {
    const employee = await service.getEmployeeById(req.params.id);

    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    logger.error(`Error fetching employee: ${err.message}`);
    if (err.message === "Employee not found") {
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

const getEmployeeByEmpId = async (req, res) => {
  logger.info(`Fetching employee with empid: ${req.params.empid}`);
  try {
    const employee = await service.getEmployeeByEmpId(req.params.empid);

    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    logger.error(`Error fetching employee: ${err.message}`);
    if (err.message === "Employee not found") {
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

const updateEmployee = async (req, res) => {
  logger.info(`Updating employee with ID: ${req.params.id}`);
  try {
    const { error } = updateEmployeeValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const employee = await service.updateEmployee(req.params.id, req.body);
    logger.info(`Employee updated: ${employee.empName}`);

    res.json({
      success: true,
      message: "Employee Updated Successfully",
      data: employee,
    });
  } catch (err) {
    logger.error(`Error updating employee: ${err.message}`);
    if (err.message === "Employee not found") {
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

const deleteEmployee = async (req, res) => {
  logger.info(`Deleting employee with ID: ${req.params.id}`);
  try {
    await service.deleteEmployee(req.params.id);
    logger.info(`Employee deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (err) {
    logger.error(`Error deleting employee: ${err.message}`);
    if (err.message === "Employee not found") {
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

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmpId,
  updateEmployee,
  deleteEmployee,
};