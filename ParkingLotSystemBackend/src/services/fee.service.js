const Fee = require("../models/Fee.model");
const ApiError = require("../utils/apiError");

exports.createFee = async ({ vehicleType, baseFare, ratePerHour }) => {
  const existing = await Fee.findOne({ vehicleType });
  if (existing) throw new ApiError(409, "Fee for this vehicle type already exists");

  return Fee.create({ vehicleType, baseFare, ratePerHour });
};

exports.getAllFees = async () => {
  return Fee.find().sort({ vehicleType: 1 });
};

exports.getFeeById = async (id) => {
  const fee = await Fee.findById(id);
  if (!fee) throw new ApiError(404, "Fee not found");
  return fee;
};

exports.getFeeByVehicleType = async (vehicleType) => {
  const fee = await Fee.findOne({ vehicleType });
  if (!fee) throw new ApiError(404, `No fee configured for vehicle type: ${vehicleType}`);
  return fee;
};

exports.updateFee = async (id, updates) => {
  const fee = await Fee.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!fee) throw new ApiError(404, "Fee not found");
  return fee;
};

exports.deleteFee = async (id) => {
  const fee = await Fee.findByIdAndDelete(id);
  if (!fee) throw new ApiError(404, "Fee not found");
  return true;
};
