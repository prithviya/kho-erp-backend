const Joi = require("joi");

exports.createPermissionSchema = Joi.object({
    module: Joi.string().trim().required(),
    action: Joi.string().trim().required(),
    permissionKey: Joi.string().trim().required(),
    description: Joi.string().allow("", null)
});