const roleAccessService = require("../services/roleAccess.service");

exports.createRoleAccess = async (req, res, next) => {
  try {
    const roleAccess = await roleAccessService.createRoleAccess(req.body);
    res.status(201).json({ success: true, message: "Role access created successfully", data: roleAccess });
  } catch (err) {
    next(err);
  }
};

exports.getAllRoleAccess = async (req, res, next) => {
  try {
    const list = await roleAccessService.getAllRoleAccess();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.getRoleAccessById = async (req, res, next) => {
  try {
    const roleAccess = await roleAccessService.getRoleAccessById(req.params.id);
    res.json({ success: true, data: roleAccess });
  } catch (err) {
    next(err);
  }
};

exports.updateRoleAccess = async (req, res, next) => {
  try {
    const roleAccess = await roleAccessService.updateRoleAccess(req.params.id, req.body);
    res.json({ success: true, message: "Role access updated successfully", data: roleAccess });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoleAccess = async (req, res, next) => {
  try {
    await roleAccessService.deleteRoleAccess(req.params.id);
    res.json({ success: true, message: "Role access deleted successfully" });
  } catch (err) {
    next(err);
  }
};
