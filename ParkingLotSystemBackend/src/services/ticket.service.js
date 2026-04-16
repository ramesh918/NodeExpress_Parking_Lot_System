const Ticket = require("../models/Ticket.model");
const ParkingSpot = require("../models/ParkingSpot.model");
const Vehicle = require("../models/Vehicle.model");
const Fee = require("../models/Fee.model");
const Invoice = require("../models/Invoice.model");
const ApiError = require("../utils/apiError");

exports.createTicket = async ({ vehicleId, parkingSpotId, entryTime }) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  const spot = await ParkingSpot.findById(parkingSpotId);
  if (!spot) throw new ApiError(404, "Parking spot not found");
  if (spot.isOccupied) throw new ApiError(400, "Parking spot is already occupied");

  // Check vehicle type matches spot type
  if (vehicle.vehicleType !== spot.spotType) {
    throw new ApiError(400, `Vehicle type (${vehicle.vehicleType}) does not match spot type (${spot.spotType})`);
  }

  // Mark spot as occupied
  spot.isOccupied = true;
  await spot.save();

  return Ticket.create({ vehicleId, parkingSpotId, entryTime });
};

exports.getAllTickets = async () => {
  return Ticket.find()
    .populate("vehicleId", "licensePlate vehicleType")
    .populate("parkingSpotId", "spotNumber spotType")
    .sort({ createdAt: -1 });
};

exports.getTicketById = async (id) => {
  const ticket = await Ticket.findById(id)
    .populate("vehicleId", "licensePlate vehicleType")
    .populate("parkingSpotId", "spotNumber spotType");
  if (!ticket) throw new ApiError(404, "Ticket not found");
  return ticket;
};

exports.updateTicket = async (id, updates) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  // When completing the ticket, free the parking spot
  if (updates.status === "COMPLETED" && ticket.status === "ACTIVE") {
    await ParkingSpot.findByIdAndUpdate(ticket.parkingSpotId, { isOccupied: false });
    if (!updates.exitTime) updates.exitTime = new Date();
  }

  Object.assign(ticket, updates);
  return ticket.save();
};

exports.checkoutTicket = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  if (ticket.status === "COMPLETED") throw new ApiError(400, "Ticket is already completed");

  // Release the parking spot
  await ParkingSpot.findByIdAndUpdate(ticket.parkingSpotId, { isOccupied: false });

  // Complete the ticket with exit time
  ticket.status = "COMPLETED";
  ticket.exitTime = new Date();
  await ticket.save();


  // Calculate amount from fee config
  const vehicle = await Vehicle.findById(ticket.vehicleId);
  const fee = await Fee.findOne({ vehicleType: vehicle.vehicleType });
  if (!fee) throw new ApiError(404, `No fee configured for vehicle type: ${vehicle.vehicleType}`);

  const hoursParked = Math.ceil((ticket.exitTime - new Date(ticket.entryTime)) / (1000 * 60 * 60));
  const amount = fee.baseFare + hoursParked * fee.ratePerHour;

  const invoice = await Invoice.create({ ticketId: ticket._id, userId, amount, status: "PENDING" });

  return { ticket, invoice };
};

exports.deleteTicket = async (id) => {
  const ticket = await Ticket.findByIdAndDelete(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  return true;
};
