const vehicleService = require("../services/vehicle.service");

exports.createVehicle = async (req, res, next) => {
  try {
    // Attach logged-in user's id as the owner
    const vehicle = await vehicleService.createVehicle({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, message: "Vehicle registered successfully", data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getVehiclesByUser(req.user.id);
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json({ success: true, message: "Vehicle updated successfully", data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    next(err);
  }
};
