const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorizeResource } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createTicketSchema,
  updateTicketSchema,
  ticketIdParamSchema,
} = require("../validations/ticket.validation");

// All routes require authentication
router.use(authMiddleware);

// Any user can create a ticket (park their vehicle)
router.post(
  "/",
  validate(createTicketSchema),
  ticketController.createTicket
);

// All roles can read tickets
router.get("/", ticketController.getAllTickets);

router.get(
  "/:id",
  validate(ticketIdParamSchema, "params"),
  ticketController.getTicketById
);

// Any user can update a ticket (e.g., mark exit)
router.patch(
  "/:id",
  validate(ticketIdParamSchema, "params"),
  validate(updateTicketSchema),
  ticketController.updateTicket
);

// Only roles with DELETE access on TICKET can delete
router.delete(
  "/:id",
  authorizeResource("TICKET", "DELETE"),
  validate(ticketIdParamSchema, "params"),
  ticketController.deleteTicket
);

module.exports = router;
