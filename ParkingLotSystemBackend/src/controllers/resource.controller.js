const resourceService = require("../services/resource.service");

exports.createResource = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json({ success: true, message: "Resource created successfully", data: resource });
  } catch (err) {
    next(err);
  }
};

exports.getAllResources = async (req, res, next) => {
  try {
    const list = await resourceService.getAllResources();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    res.json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    res.json({ success: true, message: "Resource updated successfully", data: resource });
  } catch (err) {
    next(err);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (err) {
    next(err);
  }
};
