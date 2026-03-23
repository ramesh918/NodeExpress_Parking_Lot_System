const parkingSpotService = require("../services/parkingSpot.service");

exports.createParkingSpot = async (req, res, next) => {
  try {
    const spot = await parkingSpotService.createParkingSpot(req.body);
    res.status(201).json({ success: true, message: "Parking spot created successfully", data: spot });
  } catch (err) {
    next(err);
  }
};

exports.getAllParkingSpots = async (req, res, next) => {
  try {
    // Allow filtering by parkingLotId or isOccupied via query params
    const filter = {};
    if (req.query.parkingLotId) filter.parkingLotId = req.query.parkingLotId;
    if (req.query.isOccupied !== undefined) filter.isOccupied = req.query.isOccupied === "true";
    if (req.query.spotType) filter.spotType = req.query.spotType;

    const spots = await parkingSpotService.getAllParkingSpots(filter);
    res.json({ success: true, data: spots });
  } catch (err) {
    next(err);
  }
};

exports.getParkingSpotById = async (req, res, next) => {
  try {
    const spot = await parkingSpotService.getParkingSpotById(req.params.id);
    res.json({ success: true, data: spot });
  } catch (err) {
    next(err);
  }
};

exports.updateParkingSpot = async (req, res, next) => {
  try {
    const spot = await parkingSpotService.updateParkingSpot(req.params.id, req.body);
    res.json({ success: true, message: "Parking spot updated successfully", data: spot });
  } catch (err) {
    next(err);
  }
};

exports.deleteParkingSpot = async (req, res, next) => {
  try {
    await parkingSpotService.deleteParkingSpot(req.params.id);
    res.json({ success: true, message: "Parking spot deleted successfully" });
  } catch (err) {
    next(err);
  }
};
