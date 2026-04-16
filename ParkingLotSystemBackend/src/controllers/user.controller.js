const userService = require("../services/user.service");
const ApiError = require("../utils/apiError");

exports.createUser = async (req, res, next) => {
  try {
    const targetRole = req.body.role || "USER";

    // ADMIN can only create USER accounts
    if (req.user.role === "ADMIN" && targetRole !== "USER") {
      return next(new ApiError(403, "Admins can only create USER accounts"));
    }

    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
