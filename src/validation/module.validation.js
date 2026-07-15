const Joi = require("joi");

exports.createModuleSchema = Joi.object({

    name: Joi.string().required(),

    code: Joi.string().uppercase().required(),

    route: Joi.string().required(),

    icon: Joi.string().allow("", null),

    displayOrder: Joi.number().default(0),

    parentId: Joi.number().allow(null),

    description: Joi.string().allow("", null),

    isActive: Joi.boolean()

});

exports.updateModuleSchema = exports.createModuleSchema;