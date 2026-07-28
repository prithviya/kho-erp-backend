const Joi = require("joi");

const createDepartmentValidation = Joi.object({
  departid: Joi.string().required().messages({
    "string.empty": "Department ID is required",
    "any.required": "Department ID is required",
  }),
  departmentName: Joi.string().required().messages({
    "string.empty": "Department name is required",
    "any.required": "Department name is required",
  }),
  description: Joi.string().optional().allow(""),
  location: Joi.string().optional().allow(""),
  managerId: Joi.number().optional(),
  status: Joi.string().valid("active", "inactive").default("active"),
});

const updateDepartmentValidation = Joi.object({
  departid: Joi.string().optional(),
  departmentName: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  location: Joi.string().optional().allow(""),
  managerId: Joi.number().optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});

module.exports = {
  createDepartmentValidation,
  updateDepartmentValidation,
};