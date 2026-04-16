const ParkingSpot = require("../models/ParkingSpot.model");
const ParkingLot = require("../models/ParkingLot.model");
const ApiError = require("../utils/apiError");

exports.createParkingSpot = async ({ parkingLotId, spotNumber, spotType, isOccupied }) => {
  const lot = await ParkingLot.findById(parkingLotId);
  if (!lot) throw new ApiError(404, "Parking lot not found");

  const existing = await ParkingSpot.findOne({ parkingLotId, spotNumber });
  if (existing) throw new ApiError(409, "Spot number already exists in this parking lot");

  return ParkingSpot.create({ parkingLotId, spotNumber, spotType, isOccupied });
};

exports.getAllParkingSpots = async (filter = {}) => {
  return ParkingSpot.find(filter).populate("parkingLotId", "name city").sort({ createdAt: -1 });
};

exports.getParkingSpotById = async (id) => {
  const spot = await ParkingSpot.findById(id).populate("parkingLotId", "name city");
  if (!spot) throw new ApiError(404, "Parking spot not found");
  return spot;
};

exports.updateParkingSpot = async (id, updates) => {
  const spot = await ParkingSpot.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!spot) throw new ApiError(404, "Parking spot not found");
  return spot;
};

exports.deleteParkingSpot = async (id) => {
  const spot = await ParkingSpot.findByIdAndDelete(id);
  if (!spot) throw new ApiError(404, "Parking spot not found");
  return true;
};
