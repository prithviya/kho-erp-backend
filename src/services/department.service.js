const repository = require("../repository/department.repository");
const logger = require("../helpers/logger");

const createDepartment = async (data) => {
  logger.info(`Creating department: ${data.departmentName}`);
  
  // Check if department already exists by departid
  const existingDepartment = await repository.findByDept(data.departid);
  if (existingDepartment) {
    logger.warn(`Department creation failed for departid: ${data.departid}`);
    throw new Error("Department ID already exists");
  }
  
  // Additional validation: Check if department name already exists
  // Note: You might need to add findByName method in repository
  // const departmentByName = await repository.findByName(data.departmentName);
  // if (departmentByName) {
  //   logger.warn(`Department creation failed for name: ${data.departmentName}`);
  //   throw new Error("Department name already exists");
  // }
  
  logger.info(`Department created successfully: ${data.departmentName}`);
  return repository.create(data);
};

// Get all departments
const getDepartments = () => {
  logger.info("Fetching all departments.");
  return repository.getAll();
};

// Get department by ID
const getDepartmentById = async (id) => {
  logger.info(`Fetching department with ID: ${id}`);
  const department = await repository.getById(id);
  if (!department) {
    logger.warn(`Department not found with ID: ${id}`);
    throw new Error("Department not found");
  }
  return department;
};

// Get department by departid
const getDepartmentByDepartId = async (departid) => {
  logger.info(`Fetching department with departid: ${departid}`);
  const department = await repository.findByDept(departid);
  if (!department) {
    logger.warn(`Department not found with departid: ${departid}`);
    throw new Error("Department not found");
  }
  return department;
};

// Update department
const updateDepartment = async (id, data) => {
  logger.info(`Updating department with ID: ${id}`);
  const department = await repository.getById(id);
  if (!department) {
    logger.warn(`Department not found with ID: ${id}`);
    throw new Error("Department not found");
  }
  
  // Check if new departid conflicts with another department
  if (data.departid) {
    const existingDepartment = await repository.findByDept(data.departid);
    if (existingDepartment && existingDepartment.id !== id) {
      logger.warn(`Department update failed - departid ${data.departid} already exists`);
      throw new Error("Department ID already exists");
    }
  }
  
    // Check if department name is being updated and conflicts
    // if (data.departmentName) {
    // You would need a findByName method in repository
    // const existingByName = await repository.findByName(data.departmentName);
    // if (existingByName && existingByName.id !== id) {
    //   logger.warn(`Department update failed - name ${data.departmentName} already exists`);
    //   throw new Error("Department name already exists");
    // }
//   }
  
  logger.info(`Department updated successfully: ${id}`);
  return repository.update(id, data);
};

// Delete department
const deleteDepartment = async (id) => {
  logger.info(`Deleting department with ID: ${id}`);
  const department = await repository.getById(id);
  if (!department) {
    logger.warn(`Department not found with ID: ${id}`);
    throw new Error("Department not found");
  }
  
  logger.info(`Department deleted successfully: ${id}`);
  return repository.delete(id);
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentByDepartId,
  updateDepartment,
  deleteDepartment
};