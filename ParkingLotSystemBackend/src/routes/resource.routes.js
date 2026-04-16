const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resource.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorize } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createResourceSchema,
  updateResourceSchema,
  resourceIdParamSchema,
} = require("../validations/resource.validation");

// All routes require authentication
router.use(authMiddleware);

// Any authenticated user can view available resources
router.get("/", resourceController.getAllResources);

router.get(
  "/:id",
  validate(resourceIdParamSchema, "params"),
  resourceController.getResourceById
);

// Only SUPER_ADMIN can create, update, or delete resources
router.post(
  "/",
  authorize("SUPER_ADMIN"),
  validate(createResourceSchema),
  resourceController.createResource
);

router.patch(
  "/:id",
  authorize("SUPER_ADMIN"),
  validate(resourceIdParamSchema, "params"),
  validate(updateResourceSchema),
  resourceController.updateResource
);

router.delete(
  "/:id",
  authorize("SUPER_ADMIN"),
  validate(resourceIdParamSchema, "params"),
  resourceController.deleteResource
);

module.exports = router;
