const express = require("express");
const router = express.Router();

const feeController = require("../controllers/fee.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorizeResource } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createFeeSchema,
  updateFeeSchema,
  feeIdParamSchema,
} = require("../validations/fee.validation");

// All routes require authentication
router.use(authMiddleware);

// Only roles with CREATE access on FEE can create fee entries
router.post(
  "/",
  authorizeResource("FEE", "CREATE"),
  validate(createFeeSchema),
  feeController.createFee
);

// All roles can read fees
router.get("/", feeController.getAllFees);

router.get(
  "/:id",
  validate(feeIdParamSchema, "params"),
  feeController.getFeeById
);

// Only roles with UPDATE access on FEE can update fees
router.patch(
  "/:id",
  authorizeResource("FEE", "UPDATE"),
  validate(feeIdParamSchema, "params"),
  validate(updateFeeSchema),
  feeController.updateFee
);

// Only roles with DELETE access on FEE can delete fees
router.delete(
  "/:id",
  authorizeResource("FEE", "DELETE"),
  validate(feeIdParamSchema, "params"),
  feeController.deleteFee
);

module.exports = router;
