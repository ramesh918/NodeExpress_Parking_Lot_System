const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate.middleware");
const {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} = require("../validations/user.validation");

router.post("/", validate(createUserSchema), userController.createUser);

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
