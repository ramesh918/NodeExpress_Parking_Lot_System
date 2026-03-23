const Joi = require("joi");

const createTicketSchema = Joi.object({
  vehicleId: Joi.string().trim().required().messages({
    "string.empty": "Vehicle id is required",
    "any.required": "Vehicle id is required",
  }),

  parkingSpotId: Joi.string().trim().required().messages({
    "string.empty": "Parking spot id is required",
    "any.required": "Parking spot id is required",
  }),

  entryTime: Joi.date().optional(),
}).required();

const updateTicketSchema = Joi.object({
  exitTime: Joi.date().optional(),
  status: Joi.string().valid("ACTIVE", "COMPLETED").optional().messages({
    "any.only": "Status must be ACTIVE or COMPLETED",
  }),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const ticketIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Ticket id is required",
  }),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  ticketIdParamSchema,
};
