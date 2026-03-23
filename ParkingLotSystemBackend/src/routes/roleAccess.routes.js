const express = require("express");
const router = express.Router();

const roleAccessController = require("../controllers/roleAccess.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorize } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createRoleAccessSchema,
  updateRoleAccessSchema,
  roleAccessIdParamSchema,
} = require("../validations/roleAccess.validation");

// All routes require authentication
router.use(authMiddleware);

// Only SUPER_ADMIN can manage role access
router.post(
  "/",
  authorize("SUPER_ADMIN"),
  validate(createRoleAccessSchema),
  roleAccessController.createRoleAccess
);

// All roles can read role access
router.get("/", roleAccessController.getAllRoleAccess);

router.get(
  "/:id",
  validate(roleAccessIdParamSchema, "params"),
  roleAccessController.getRoleAccessById
);

router.patch(
  "/:id",
  authorize("SUPER_ADMIN"),
  validate(roleAccessIdParamSchema, "params"),
  validate(updateRoleAccessSchema),
  roleAccessController.updateRoleAccess
);

router.delete(
  "/:id",
  authorize("SUPER_ADMIN"),
  validate(roleAccessIdParamSchema, "params"),
  roleAccessController.deleteRoleAccess
);

module.exports = router;
