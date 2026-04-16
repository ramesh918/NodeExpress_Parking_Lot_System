const Joi = require("joi");

const createInvoiceSchema = Joi.object({
  ticketId: Joi.string().trim().required().messages({
    "string.empty": "Ticket id is required",
    "any.required": "Ticket id is required",
  }),

  userId: Joi.string().trim().required().messages({
    "string.empty": "User id is required",
    "any.required": "User id is required",
  }),

  amount: Joi.number().min(0).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount cannot be negative",
    "any.required": "Amount is required",
  }),

  status: Joi.string().valid("PENDING", "PAID").optional().messages({
    "any.only": "Status must be PENDING or PAID",
  }),
}).required();

const updateInvoiceSchema = Joi.object({
  amount: Joi.number().min(0).optional(),
  status: Joi.string().valid("PENDING", "PAID").optional().messages({
    "any.only": "Status must be PENDING or PAID",
  }),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const invoiceIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "any.required": "Invoice id is required",
  }),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceIdParamSchema,
};
