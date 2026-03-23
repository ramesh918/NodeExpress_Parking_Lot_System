const Joi = require("joi");

const createResourceSchema = Joi.object({
  name: Joi.string().trim().uppercase().required().messages({
    "string.empty": "Resource name is required",
    "any.required": "Resource name is required",
  }),

  description: Joi.string().trim().allow("").optional(),
}).required();

const updateResourceSchema = Joi.object({
  description: Joi.string().trim().allow("").required().messages({
    "any.required": "Description is required",
  }),
}).required();

const resourceIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Resource id is required",
  }),
});

module.exports = {
  createResourceSchema,
  updateResourceSchema,
  resourceIdParamSchema,
};
