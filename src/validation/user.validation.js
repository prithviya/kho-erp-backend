const Joi = require("joi");

const createUserValidation = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().allow("", null),
    email: Joi.string().trim().email().required(),
    username: Joi.string().trim().required(),
    phone: Joi.string().trim().allow("", null),
    employeeRecord: Joi.string().trim().allow("", null),
    password: Joi.string().min(6).required(),
    roleIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
    isActive: Joi.boolean().optional()
});

const updateUserValidation = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().allow("", null),
    email: Joi.string().trim().email().required(),
    username: Joi.string().trim().required(),
    phone: Joi.string().trim().allow("", null),
    employeeRecord: Joi.string().trim().allow("", null),
    password: Joi.string().min(6).allow("", null),
    roleIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
    isActive: Joi.boolean().optional()
});

const updateUserStatusValidation = Joi.object({
    isActive: Joi.boolean().required()
});

module.exports = {
    createUserValidation,
    updateUserValidation,
    updateUserStatusValidation
};