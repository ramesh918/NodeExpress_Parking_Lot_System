const Invoice = require("../models/Invoice.model");
const Ticket = require("../models/Ticket.model");
const Fee = require("../models/Fee.model");
const Vehicle = require("../models/Vehicle.model");
const ApiError = require("../utils/apiError");

// Auto-calculate amount based on ticket duration and fee config
exports.generateInvoice = async ({ ticketId, userId }) => {
  const ticket = await Ticket.findById(ticketId).populate("vehicleId");
  if (!ticket) throw new ApiError(404, "Ticket not found");
  if (ticket.status !== "COMPLETED") throw new ApiError(400, "Invoice can only be generated for completed tickets");

  const existing = await Invoice.findOne({ ticketId });
  if (existing) throw new ApiError(409, "Invoice already exists for this ticket");

  const vehicle = ticket.vehicleId;
  const fee = await Fee.findOne({ vehicleType: vehicle.vehicleType });
  if (!fee) throw new ApiError(404, `No fee configured for vehicle type: ${vehicle.vehicleType}`);

  const entryTime = new Date(ticket.entryTime);
  const exitTime = new Date(ticket.exitTime);
  const hoursParked = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)); // round up to nearest hour

  const amount = fee.baseFare + hoursParked * fee.ratePerHour;

  return Invoice.create({ ticketId, userId, amount, status: "PENDING" });
};

exports.createInvoice = async ({ ticketId, userId, amount, status }) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  return Invoice.create({ ticketId, userId, amount, status });
};

exports.getAllInvoices = async () => {
  return Invoice.find()
    .populate("ticketId", "entryTime exitTime status")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

exports.getInvoicesByUser = async (userId) => {
  return Invoice.find({ userId })
    .populate("ticketId", "entryTime exitTime status")
    .sort({ createdAt: -1 });
};

exports.getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id)
    .populate("ticketId", "entryTime exitTime status")
    .populate("userId", "name email");
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
};

exports.updateInvoice = async (id, updates) => {
  const invoice = await Invoice.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
};

exports.deleteInvoice = async (id) => {
  const invoice = await Invoice.findByIdAndDelete(id);
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return true;
};
