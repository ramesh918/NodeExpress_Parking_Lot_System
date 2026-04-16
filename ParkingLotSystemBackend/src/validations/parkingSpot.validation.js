const Joi = require("joi");

const VEHICLE_TYPES = ["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"];

const mongoId = Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/);

const createParkingSpotSchema = Joi.object({
  parkingLotId: mongoId.required().messages({
    "string.empty": "Parking lot id is required",
    "any.required": "Parking lot id is required",
    "string.pattern.base": "parkingLotId must be a valid MongoDB ObjectId",
  }),

  spotNumber: Joi.string().trim().required().messages({
    "string.empty": "Spot number is required",
    "any.required": "Spot number is required",
  }),

  spotType: Joi.string().valid(...VEHICLE_TYPES).required().messages({
    "any.only": "Spot type must be TWO_WHEELER, THREE_WHEELER, or FOUR_WHEELER",
    "any.required": "Spot type is required",
  }),

  isOccupied: Joi.boolean().optional(),
}).required();

const updateParkingSpotSchema = Joi.object({
  spotNumber: Joi.string().trim().optional(),
  spotType: Joi.string().valid(...VEHICLE_TYPES).optional(),
  isOccupied: Joi.boolean().optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const parkingSpotIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Parking spot id is required",
  }),
});

module.exports = {
  createParkingSpotSchema,
  updateParkingSpotSchema,
  parkingSpotIdParamSchema,
};
