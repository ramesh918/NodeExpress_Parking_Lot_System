const parkingLotService = require("../services/parkingLot.service");

exports.createParkingLot = async (req, res, next) => {
  try {
    const lot = await parkingLotService.createParkingLot(req.body);
    res.status(201).json({ success: true, message: "Parking lot created successfully", data: lot });
  } catch (err) {
    next(err);
  }
};

exports.getAllParkingLots = async (req, res, next) => {
  try {
    const lots = await parkingLotService.getAllParkingLots();
    res.json({ success: true, data: lots });
  } catch (err) {
    next(err);
  }
};

exports.getParkingLotById = async (req, res, next) => {
  try {
    const lot = await parkingLotService.getParkingLotById(req.params.id);
    res.json({ success: true, data: lot });
  } catch (err) {
    next(err);
  }
};

exports.updateParkingLot = async (req, res, next) => {
  try {
    const lot = await parkingLotService.updateParkingLot(req.params.id, req.body);
    res.json({ success: true, message: "Parking lot updated successfully", data: lot });
  } catch (err) {
    next(err);
  }
};

exports.deleteParkingLot = async (req, res, next) => {
  try {
    await parkingLotService.deleteParkingLot(req.params.id);
    res.json({ success: true, message: "Parking lot deleted successfully" });
  } catch (err) {
    next(err);
  }
};
