const ParkingLot = require("../models/ParkingLot.model");
const ApiError = require("../utils/apiError");

exports.createParkingLot = async ({ name, address, city, totalSpots }) => {
  return ParkingLot.create({ name, address, city, totalSpots });
};

exports.getAllParkingLots = async () => {
  return ParkingLot.find().sort({ createdAt: -1 });
};

exports.getParkingLotById = async (id) => {
  const lot = await ParkingLot.findById(id);
  if (!lot) throw new ApiError(404, "Parking lot not found");
  return lot;
};

exports.updateParkingLot = async (id, updates) => {
  const lot = await ParkingLot.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!lot) throw new ApiError(404, "Parking lot not found");
  return lot;
};

exports.deleteParkingLot = async (id) => {
  const lot = await ParkingLot.findByIdAndDelete(id);
  if (!lot) throw new ApiError(404, "Parking lot not found");
  return true;
};
