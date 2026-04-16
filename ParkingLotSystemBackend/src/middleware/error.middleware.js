const ApiError = require("../utils/apiError");

module.exports = (err, req, res, next) => {
  // Mongoose validation errors (schema validations)
  if (err && err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details,
    });
  }

  // invalid ObjectId
  if (err && err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid id format",
    });
  }

  // custom errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  // fallback
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
