const Joi = require("joi");

const createParkingLotSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),

  city: Joi.string().trim().required().messages({
    "string.empty": "City is required",
    "any.required": "City is required",
  }),

  totalSpots: Joi.number().integer().min(1).required().messages({
    "number.base": "Total spots must be a number",
    "number.min": "Total spots must be at least 1",
    "any.required": "Total spots is required",
  }),
}).required();

const updateParkingLotSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  totalSpots: Joi.number().integer().min(1).optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const parkingLotIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Parking lot id is required",
  }),
});

module.exports = {
  createParkingLotSchema,
  updateParkingLotSchema,
  parkingLotIdParamSchema,
};
