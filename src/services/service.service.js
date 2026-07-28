const repository = require("../repository/service.repository");
const logger = require("../helpers/logger");

const createService = async (data) => {
  logger.info(`Creating service: ${data.serviceName}`);
  
  // Check if service already exists by serviceid
  const existingService = await repository.findByDept(data.serviceid);
  if (existingService) {
    logger.warn(`Service creation failed for serviceid: ${data.serviceid}`);
    throw new Error("Service with this ID already exists");
  }
  
  // Check if service name already exists
  const serviceByName = await repository.findByName(data.serviceName);
  if (serviceByName) {
    logger.warn(`Service creation failed for name: ${data.serviceName}`);
    throw new Error("Service name already exists");
  }
  
  logger.info(`Service created successfully: ${data.serviceName}`);
  return repository.create(data);
};

// Get all services
const getServices = () => {
  logger.info("Fetching all services.");
  return repository.getAll();
};

// Get service by ID
const getServiceById = async (id) => {
  logger.info(`Fetching service with ID: ${id}`);
  const service = await repository.getById(id);
  if (!service) {
    logger.warn(`Service not found with ID: ${id}`);
    throw new Error("Service not found");
  }
  return service;
};

// Get service by serviceid
const getServiceByServiceId = async (serviceid) => {
  logger.info(`Fetching service with serviceid: ${serviceid}`);
  const service = await repository.findByDept(serviceid);
  if (!service) {
    logger.warn(`Service not found with serviceid: ${serviceid}`);
    throw new Error("Service not found");
  }
  return service;
};

// Get services by department
const getServicesByDepartment = async (departmentId) => {
  logger.info(`Fetching services for department: ${departmentId}`);
  const services = await repository.findAllByDepartment(departmentId);
  return services;
};

// Get active services
const getActiveServices = async () => {
  logger.info("Fetching active services.");
  const services = await repository.findActiveServices();
  return services;
};

// Get services by category
const getServicesByCategory = async (category) => {
  logger.info(`Fetching services by category: ${category}`);
  const services = await repository.findByCategory(category);
  return services;
};

// Update service
const updateService = async (id, data) => {
  logger.info(`Updating service with ID: ${id}`);
  const service = await repository.getById(id);
  if (!service) {
    logger.warn(`Service not found with ID: ${id}`);
    throw new Error("Service not found");
  }
  
  // Check if new serviceid conflicts with another service
  if (data.serviceid) {
    const existingService = await repository.findByDept(data.serviceid);
    if (existingService && existingService.id !== id) {
      logger.warn(`Service update failed - serviceid ${data.serviceid} already exists`);
      throw new Error("Service ID already exists");
    }
  }
  
  // Check if service name is being updated and conflicts
  if (data.serviceName) {
    const existingByName = await repository.findByName(data.serviceName);
    if (existingByName && existingByName.id !== id) {
      logger.warn(`Service update failed - name ${data.serviceName} already exists`);
      throw new Error("Service name already exists");
    }
  }
  
  logger.info(`Service updated successfully: ${id}`);
  return repository.update(id, data);
};

// Update service status
const updateServiceStatus = async (id, status) => {
  logger.info(`Updating service status for ID: ${id}`);
  const service = await repository.getById(id);
  if (!service) {
    logger.warn(`Service not found with ID: ${id}`);
    throw new Error("Service not found");
  }
  
  // Validate status
  const validStatuses = ['active', 'inactive', 'archived'];
  if (!validStatuses.includes(status)) {
    logger.warn(`Invalid status provided: ${status}`);
    throw new Error("Invalid status. Must be active, inactive, or archived");
  }
  
  logger.info(`Service status updated successfully: ${id} - ${status}`);
  return repository.update(id, { status });
};

// Delete service
const deleteService = async (id) => {
  logger.info(`Deleting service with ID: ${id}`);
  const service = await repository.getById(id);
  if (!service) {
    logger.warn(`Service not found with ID: ${id}`);
    throw new Error("Service not found");
  }
  
  // Optional: Check if service is being used by any employee or department
  // const usageCount = await repository.countServiceUsage(id);
  // if (usageCount > 0) {
  //   logger.warn(`Cannot delete service with ID: ${id} - in use`);
  //   throw new Error("Cannot delete service as it is currently in use");
  // }
  
  logger.info(`Service deleted successfully: ${id}`);
  return repository.delete(id);
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  getServiceByServiceId,
  getServicesByDepartment,
  getActiveServices,
  getServicesByCategory,
  updateService,
  updateServiceStatus,
  deleteService
};