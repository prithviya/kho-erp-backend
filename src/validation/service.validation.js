const Joi = require("joi");

const createServiceValidation = Joi.object({
  serviceid: Joi.string().required().messages({
    "string.empty": "Service ID is required",
    "any.required": "Service ID is required",
  }),
  serviceName: Joi.string().required().messages({
    "string.empty": "Service name is required",
    "any.required": "Service name is required",
  }),
  description: Joi.string().optional().allow(""),
  departmentId: Joi.number().optional(),
  price: Joi.number().optional().min(0).messages({
    "number.min": "Price cannot be negative",
  }),
  duration: Joi.string().optional().allow(""),
  category: Joi.string().optional().allow(""),
  status: Joi.string().valid("active", "inactive", "archived").default("active"),
});

const updateServiceValidation = Joi.object({
  serviceid: Joi.string().optional(),
  serviceName: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  departmentId: Joi.number().optional(),
  price: Joi.number().optional().min(0).messages({
    "number.min": "Price cannot be negative",
  }),
  duration: Joi.string().optional().allow(""),
  category: Joi.string().optional().allow(""),
  status: Joi.string().valid("active", "inactive", "archived").optional(),
});

module.exports = {
  createServiceValidation,
  updateServiceValidation,
};