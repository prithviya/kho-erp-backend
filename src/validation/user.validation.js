const Joi = require("joi");

const createUserValidation = Joi.object({
  name: Joi.string().required(),

  email: Joi.string().email().required(),

  username: Joi.string().required(),

  password: Joi.string().min(6).required(),

  employee_id: Joi.number().allow(null),

  role: Joi.string(),

  privileges: Joi.string(),

  status: Joi.string().valid("active", "inactive"),
});

module.exports = {
  createUserValidation,
};