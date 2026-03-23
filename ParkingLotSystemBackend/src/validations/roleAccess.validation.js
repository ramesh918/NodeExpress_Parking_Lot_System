const Joi = require("joi");

const createRoleAccessSchema = Joi.object({
  role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "USER").required().messages({
    "any.only": "Role must be SUPER_ADMIN, ADMIN, or USER",
    "any.required": "Role is required",
  }),

  resource: Joi.string().trim().required().messages({
    "string.empty": "Resource is required",
    "any.required": "Resource is required",
  }),

  actions: Joi.array()
    .items(Joi.string().valid("CREATE", "READ", "UPDATE", "DELETE"))
    .min(1)
    .required()
    .messages({
      "array.base": "Actions must be an array",
      "array.min": "At least one action is required",
      "any.required": "Actions are required",
    }),
}).required();

const updateRoleAccessSchema = Joi.object({
  actions: Joi.array()
    .items(Joi.string().valid("CREATE", "READ", "UPDATE", "DELETE"))
    .min(1)
    .required()
    .messages({
      "array.base": "Actions must be an array",
      "array.min": "At least one action is required",
      "any.required": "Actions are required",
    }),
}).required();

const roleAccessIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "RoleAccess id is required",
  }),
});

module.exports = {
  createRoleAccessSchema,
  updateRoleAccessSchema,
  roleAccessIdParamSchema,
};
