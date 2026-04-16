const express = require("express");
const router = express.Router();

const parkingLotController = require("../controllers/parkingLot.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorizeResource } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createParkingLotSchema,
  updateParkingLotSchema,
  parkingLotIdParamSchema,
} = require("../validations/parkingLot.validation");

// All routes require authentication
router.use(authMiddleware);

// All roles can read parking lots
router.get("/", parkingLotController.getAllParkingLots);

router.get(
  "/:id",
  validate(parkingLotIdParamSchema, "params"),
  parkingLotController.getParkingLotById
);

// Only roles with the matching RoleAccess entry can create, update, delete
router.post(
  "/",
  authorizeResource("PARKINGLOT", "CREATE"),
  validate(createParkingLotSchema),
  parkingLotController.createParkingLot
);

router.patch(
  "/:id",
  authorizeResource("PARKINGLOT", "UPDATE"),
  validate(parkingLotIdParamSchema, "params"),
  validate(updateParkingLotSchema),
  parkingLotController.updateParkingLot
);

router.delete(
  "/:id",
  authorizeResource("PARKINGLOT", "DELETE"),
  validate(parkingLotIdParamSchema, "params"),
  parkingLotController.deleteParkingLot
);

module.exports = router;
