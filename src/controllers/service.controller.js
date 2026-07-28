const service = require("../services/service.service");
const { createServiceValidation, updateServiceValidation } = require("../validation/service.validation");
const logger = require("../helpers/logger");

const createService = async (req, res) => {
  logger.info("Creating service.");
  try {
    const { error } = createServiceValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const newService = await service.createService(req.body);
    logger.info(`Service created: ${newService.serviceName}`);

    res.status(201).json({
      success: true,
      message: "Service Created Successfully",
      data: newService,
    });
  } catch (err) {
    logger.error(`Error creating service: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getServices = async (req, res) => {
  logger.info("Fetching all services.");
  try {
    const services = await service.getServices();

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    logger.error(`Error fetching services: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getServiceById = async (req, res) => {
  logger.info(`Fetching service with ID: ${req.params.id}`);
  try {
    const serviceData = await service.getServiceById(req.params.id);

    res.json({
      success: true,
      data: serviceData,
    });
  } catch (err) {
    logger.error(`Error fetching service: ${err.message}`);
    if (err.message === "Service not found") {
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

const getServiceByServiceId = async (req, res) => {
  logger.info(`Fetching service with serviceid: ${req.params.serviceid}`);
  try {
    const serviceData = await service.getServiceByServiceId(req.params.serviceid);

    res.json({
      success: true,
      data: serviceData,
    });
  } catch (err) {
    logger.error(`Error fetching service: ${err.message}`);
    if (err.message === "Service not found") {
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

const getServicesByDepartment = async (req, res) => {
  logger.info(`Fetching services for department ID: ${req.params.departmentId}`);
  try {
    const services = await service.getServicesByDepartment(req.params.departmentId);

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    logger.error(`Error fetching services by department: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getActiveServices = async (req, res) => {
  logger.info("Fetching active services.");
  try {
    const services = await service.getActiveServices();

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    logger.error(`Error fetching active services: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getServicesByCategory = async (req, res) => {
  logger.info(`Fetching services by category: ${req.params.category}`);
  try {
    const services = await service.getServicesByCategory(req.params.category);

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    logger.error(`Error fetching services by category: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateService = async (req, res) => {
  logger.info(`Updating service with ID: ${req.params.id}`);
  try {
    const { error } = updateServiceValidation.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedService = await service.updateService(req.params.id, req.body);
    logger.info(`Service updated: ${updatedService.serviceName}`);

    res.json({
      success: true,
      message: "Service Updated Successfully",
      data: updatedService,
    });
  } catch (err) {
    logger.error(`Error updating service: ${err.message}`);
    if (err.message === "Service not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message === "Service ID already exists" || err.message === "Service name already exists") {
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

const updateServiceStatus = async (req, res) => {
  logger.info(`Updating service status for ID: ${req.params.id}`);
  try {
    const { status } = req.body;
    const updatedService = await service.updateServiceStatus(req.params.id, status);
    logger.info(`Service status updated: ${updatedService.serviceName} - ${status}`);

    res.json({
      success: true,
      message: `Service status updated to ${status}`,
      data: updatedService,
    });
  } catch (err) {
    logger.error(`Error updating service status: ${err.message}`);
    if (err.message === "Service not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Invalid status")) {
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

const deleteService = async (req, res) => {
  logger.info(`Deleting service with ID: ${req.params.id}`);
  try {
    await service.deleteService(req.params.id);
    logger.info(`Service deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Service Deleted Successfully",
    });
  } catch (err) {
    logger.error(`Error deleting service: ${err.message}`);
    if (err.message === "Service not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Cannot delete service")) {
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
  createService,
  getServices,
  getServiceById,
  getServiceByServiceId,
  getServicesByDepartment,
  getActiveServices,
  getServicesByCategory,
  updateService,
  updateServiceStatus,
  deleteService,
};