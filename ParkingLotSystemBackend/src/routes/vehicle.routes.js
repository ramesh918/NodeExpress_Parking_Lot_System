const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorizeResource } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdParamSchema,
} = require("../validations/vehicle.validation");

// All routes require authentication
router.use(authMiddleware);

// Any user can register their own vehicle
router.post(
  "/",
  validate(createVehicleSchema),
  vehicleController.createVehicle
);

// Get my vehicles (logged-in user's vehicles)
router.get("/my", vehicleController.getMyVehicles);

// Only roles with READ access on VEHICLE can list all vehicles
router.get(
  "/",
  authorizeResource("VEHICLE", "READ"),
  vehicleController.getAllVehicles
);

router.get(
  "/:id",
  validate(vehicleIdParamSchema, "params"),
  vehicleController.getVehicleById
);

// Any user can update their vehicle (no role restriction per schema notes)
router.patch(
  "/:id",
  validate(vehicleIdParamSchema, "params"),
  validate(updateVehicleSchema),
  vehicleController.updateVehicle
);

// Only roles with DELETE access on VEHICLE can delete
router.delete(
  "/:id",
  authorizeResource("VEHICLE", "DELETE"),
  validate(vehicleIdParamSchema, "params"),
  vehicleController.deleteVehicle
);

module.exports = router;
