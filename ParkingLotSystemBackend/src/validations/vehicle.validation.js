const Joi = require("joi");

const VEHICLE_TYPES = ["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"];

const createVehicleSchema = Joi.object({
  licensePlate: Joi.string().trim().uppercase().required().messages({
    "string.empty": "License plate is required",
    "any.required": "License plate is required",
  }),

  vehicleType: Joi.string().valid(...VEHICLE_TYPES).required().messages({
    "any.only": "Vehicle type must be TWO_WHEELER, THREE_WHEELER, or FOUR_WHEELER",
    "any.required": "Vehicle type is required",
  }),

  make: Joi.string().trim().required().messages({
    "string.empty": "Vehicle make is required",
    "any.required": "Vehicle make is required",
  }),

  model: Joi.string().trim().required().messages({
    "string.empty": "Vehicle model is required",
    "any.required": "Vehicle model is required",
  }),

  color: Joi.string().trim().required().messages({
    "string.empty": "Vehicle color is required",
    "any.required": "Vehicle color is required",
  }),
}).required();

const updateVehicleSchema = Joi.object({
  licensePlate: Joi.string().trim().uppercase().optional(),
  vehicleType: Joi.string().valid(...VEHICLE_TYPES).optional(),
  make: Joi.string().trim().optional(),
  model: Joi.string().trim().optional(),
  color: Joi.string().trim().optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const vehicleIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Vehicle id is required",
  }),
});

module.exports = {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdParamSchema,
};
