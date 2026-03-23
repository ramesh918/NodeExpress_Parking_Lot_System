const Vehicle = require("../models/Vehicle.model");
const ApiError = require("../utils/apiError");

exports.createVehicle = async ({ userId, licensePlate, vehicleType, make, model, color }) => {
  const existing = await Vehicle.findOne({ licensePlate: licensePlate.toUpperCase() });
  if (existing) throw new ApiError(409, "Vehicle with this license plate already exists");

  return Vehicle.create({ userId, licensePlate, vehicleType, make, model, color });
};

exports.getAllVehicles = async () => {
  return Vehicle.find().populate("userId", "name email").sort({ createdAt: -1 });
};

exports.getVehiclesByUser = async (userId) => {
  return Vehicle.find({ userId }).sort({ createdAt: -1 });
};

exports.getVehicleById = async (id) => {
  const vehicle = await Vehicle.findById(id).populate("userId", "name email");
  if (!vehicle) throw new ApiError(404, "Vehicle not found");
  return vehicle;
};

exports.updateVehicle = async (id, updates) => {
  const vehicle = await Vehicle.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");
  return vehicle;
};

exports.deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findByIdAndDelete(id);
  if (!vehicle) throw new ApiError(404, "Vehicle not found");
  return true;
};
