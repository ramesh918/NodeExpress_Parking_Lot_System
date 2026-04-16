const RoleAccess = require("../models/RoleAccess.model");
const Resource = require("../models/Resource.model");
const ApiError = require("../utils/apiError");

exports.createRoleAccess = async ({ role, resource, actions }) => {
  const normalizedResource = resource.toUpperCase().trim();

  // Ensure the resource name is registered in the system
  const resourceDoc = await Resource.findOne({ name: normalizedResource });
  if (!resourceDoc) {
    throw new ApiError(404, `Resource '${normalizedResource}' does not exist. Create it first via POST /api/resources`);
  }

  const existing = await RoleAccess.findOne({ role, resource: normalizedResource });
  if (existing) throw new ApiError(409, "Role access for this resource already exists");

  return RoleAccess.create({ role, resource: normalizedResource, actions });
};

exports.getAllRoleAccess = async () => {
  return RoleAccess.find().sort({ role: 1, resource: 1 });
};

exports.getRoleAccessById = async (id) => {
  const roleAccess = await RoleAccess.findById(id);
  if (!roleAccess) throw new ApiError(404, "Role access not found");
  return roleAccess;
};

exports.updateRoleAccess = async (id, updates) => {
  const roleAccess = await RoleAccess.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!roleAccess) throw new ApiError(404, "Role access not found");
  return roleAccess;
};

exports.deleteRoleAccess = async (id) => {
  const roleAccess = await RoleAccess.findByIdAndDelete(id);
  if (!roleAccess) throw new ApiError(404, "Role access not found");
  return true;
};
