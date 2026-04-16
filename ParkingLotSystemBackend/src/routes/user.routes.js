const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate.middleware");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorize } = require("../middleware/authorization.middleware");
const {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} = require("../validations/user.validation");

// SUPER_ADMIN → can create USER or ADMIN
// ADMIN       → can create USER only (enforced in controller)
router.post(
  "/",
  authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(createUserSchema),
  userController.createUser
);

router.get("/", userController.getUsers);

router.get(
  "/:id",
  validate(userIdParamSchema, "params"),
  userController.getUserById
);

router.patch(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:id",
  validate(userIdParamSchema, "params"),
  userController.deleteUser
);

module.exports = router;
