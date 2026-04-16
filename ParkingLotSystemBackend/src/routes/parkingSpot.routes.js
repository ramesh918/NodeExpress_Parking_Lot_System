const express = require("express");
const router = express.Router();

const parkingSpotController = require("../controllers/parkingSpot.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorizeResource } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createParkingSpotSchema,
  updateParkingSpotSchema,
  parkingSpotIdParamSchema,
} = require("../validations/parkingSpot.validation");

// All routes require authentication
router.use(authMiddleware);

// All roles can read parking spots
router.get("/", parkingSpotController.getAllParkingSpots);

router.get(
  "/:id",
  validate(parkingSpotIdParamSchema, "params"),
  parkingSpotController.getParkingSpotById
);

// Only roles with the matching RoleAccess entry can create and delete
router.post(
  "/",
  authorizeResource("PARKINGSPOT", "CREATE"),
  validate(createParkingSpotSchema),
  parkingSpotController.createParkingSpot
);

// All roles can update a parking spot (e.g., user marking it occupied)
router.patch(
  "/:id",
  validate(parkingSpotIdParamSchema, "params"),
  validate(updateParkingSpotSchema),
  parkingSpotController.updateParkingSpot
);

router.delete(
  "/:id",
  authorizeResource("PARKINGSPOT", "DELETE"),
  validate(parkingSpotIdParamSchema, "params"),
  parkingSpotController.deleteParkingSpot
);

module.exports = router;
