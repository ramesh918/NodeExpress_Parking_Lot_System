const Resource = require("../models/Resource.model");
const ApiError = require("../utils/apiError");

exports.createResource = async ({ name, description }) => {
  const normalizedName = name.toUpperCase().trim();

  const existing = await Resource.findOne({ name: normalizedName });
  if (existing) throw new ApiError(409, `Resource '${normalizedName}' already exists`);

  return Resource.create({ name: normalizedName, description });
};

exports.getAllResources = async () => {
  return Resource.find().sort({ name: 1 });
};

exports.getResourceById = async (id) => {
  const resource = await Resource.findById(id);
  if (!resource) throw new ApiError(404, "Resource not found");
  return resource;
};

exports.updateResource = async (id, updates) => {
  const resource = await Resource.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!resource) throw new ApiError(404, "Resource not found");
  return resource;
};

exports.deleteResource = async (id) => {
  const resource = await Resource.findByIdAndDelete(id);
  if (!resource) throw new ApiError(404, "Resource not found");
  return true;
};
