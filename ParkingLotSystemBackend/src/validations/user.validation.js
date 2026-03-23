const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  role: Joi.string().valid("ADMIN", "USER", "SUPER_ADMIN").optional().messages({
    "any.only": "Role must be ADMIN, USER, or SUPER_ADMIN",
  }),
}).required();

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  role: Joi.string().valid("ADMIN", "USER", "SUPER_ADMIN").optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const userIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "User id is required",
  }),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
};
