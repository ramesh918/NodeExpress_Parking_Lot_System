const ticketService = require("../services/ticket.service");

exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json({ success: true, message: "Ticket created successfully", data: ticket });
  } catch (err) {
    next(err);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.json({ success: true, message: "Ticket updated successfully", data: ticket });
  } catch (err) {
    next(err);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    await ticketService.deleteTicket(req.params.id);
    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (err) {
    next(err);
  }
};
