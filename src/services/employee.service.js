const bcrypt = require("bcrypt");
const repository = require("../repository/employee.repository");
const logger = require("../helpers/logger");

const createEmployee = async (data) => {
  logger.info(`Creating employee: ${data.empName}`);
  
  // Check if employee already exists by empid
  const existingEmployee = await repository.findByDept(data.empid);
  if (existingEmployee) {
    logger.warn(`Employee creation failed for empid: ${data.empid}`);
    throw new Error("Employee ID already exists");
  }
  
  // Check if email already exists (if employee has email field)
  // Note: You might need to add findByEmail method in repository
  // const email = await repository.findByEmail(data.email);
  // if (email) {
  //   logger.warn(`Employee creation failed for email: ${data.email}`);
  //   throw new Error("Email already exists");
  // }
  
  // Hash password if employee has password field
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  
  logger.info(`Employee created successfully: ${data.empName}`);
  return repository.create(data);
};

// Get all employees
const getEmployees = () => {
  logger.info("Fetching all employees.");
  return repository.getAll();
};

// Get employee by ID
const getEmployeeById = async (id) => {
  logger.info(`Fetching employee with ID: ${id}`);
  const employee = await repository.getById(id);
  if (!employee) {
    logger.warn(`Employee not found with ID: ${id}`);
    throw new Error("Employee not found");
  }
  return employee;
};

// Get employee by empid
const getEmployeeByEmpId = async (empid) => {
  logger.info(`Fetching employee with empid: ${empid}`);
  const employee = await repository.findByDept(empid);
  if (!employee) {
    logger.warn(`Employee not found with empid: ${empid}`);
    throw new Error("Employee not found");
  }
  return employee;
};

// Update employee
const updateEmployee = async (id, data) => {
  logger.info(`Updating employee with ID: ${id}`);
  const employee = await repository.getById(id);
  if (!employee) {
    logger.warn(`Employee not found with ID: ${id}`);
    throw new Error("Employee not found");
  }
  
  // Check if new empid conflicts with another employee
  if (data.empid) {
    const existingEmployee = await repository.findByDept(data.empid);
    if (existingEmployee && existingEmployee.id !== id) {
      logger.warn(`Employee update failed - empid ${data.empid} already exists`);
      throw new Error("Employee ID already exists");
    }
  }
  
  // Hash password if it's being updated
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  
  logger.info(`Employee updated successfully: ${id}`);
  return repository.update(id, data);
};

// Delete employee
const deleteEmployee = async (id) => {
  logger.info(`Deleting employee with ID: ${id}`);
  const employee = await repository.getById(id);
  if (!employee) {
    logger.warn(`Employee not found with ID: ${id}`);
    throw new Error("Employee not found");
  }
  
  logger.info(`Employee deleted successfully: ${id}`);
  return repository.delete(id);
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmpId,
  updateEmployee,
  deleteEmployee
};