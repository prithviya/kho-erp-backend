const Joi = require("joi");

exports.createRoleSchema = Joi.object({
    name: Joi.string().trim().required(),
    code: Joi.string().trim().uppercase().required(),
    description: Joi.string().allow("", null),
    isActive: Joi.boolean().optional()
});