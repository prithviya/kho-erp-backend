const Joi = require("joi");

const createEmployeeValidation = Joi.object({
  empid: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
    "any.required": "Employee ID is required",
  }),
  empName: Joi.string().required().messages({
    "string.empty": "Employee name is required",
    "any.required": "Employee name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  phone: Joi.string().optional().allow(""),
  role: Joi.string().valid("admin", "manager", "employee", "user").default("employee"),
  departmentId: Joi.number().optional(),
  designation: Joi.string().optional().allow(""),
  salary: Joi.number().optional(),
  joiningDate: Joi.date().optional(),
  status: Joi.string().valid("active", "inactive", "terminated").default("active"),
});

const updateEmployeeValidation = Joi.object({
  empid: Joi.string().optional(),
  empName: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters long",
  }),
  phone: Joi.string().optional().allow(""),
  role: Joi.string().valid("admin", "manager", "employee", "user").optional(),
  departmentId: Joi.number().optional(),
  designation: Joi.string().optional().allow(""),
  salary: Joi.number().optional(),
  joiningDate: Joi.date().optional(),
  status: Joi.string().valid("active", "inactive", "terminated").optional(),
});

module.exports = {
  createEmployeeValidation,
  updateEmployeeValidation,
};