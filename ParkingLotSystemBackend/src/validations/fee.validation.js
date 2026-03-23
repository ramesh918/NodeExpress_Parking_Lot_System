const Joi = require("joi");

const VEHICLE_TYPES = ["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"];

const createFeeSchema = Joi.object({
  vehicleType: Joi.string().valid(...VEHICLE_TYPES).required().messages({
    "any.only": "Vehicle type must be TWO_WHEELER, THREE_WHEELER, or FOUR_WHEELER",
    "any.required": "Vehicle type is required",
  }),

  baseFare: Joi.number().min(0).required().messages({
    "number.base": "Base fare must be a number",
    "number.min": "Base fare cannot be negative",
    "any.required": "Base fare is required",
  }),

  ratePerHour: Joi.number().min(0).required().messages({
    "number.base": "Rate per hour must be a number",
    "number.min": "Rate per hour cannot be negative",
    "any.required": "Rate per hour is required",
  }),
}).required();

const updateFeeSchema = Joi.object({
  baseFare: Joi.number().min(0).optional(),
  ratePerHour: Joi.number().min(0).optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const feeIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Fee id is required",
  }),
});

module.exports = {
  createFeeSchema,
  updateFeeSchema,
  feeIdParamSchema,
};
