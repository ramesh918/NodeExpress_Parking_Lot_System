const ApiError = require("../utils/apiError");
const RoleAccess = require("../models/RoleAccess.model");

// Role-based guard — usage: authorize("SUPER_ADMIN", "ADMIN")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    next();
  };
};

// Resource + action guard — usage: authorizeResource("ParkingLot", "CREATE")
// SUPER_ADMIN bypasses all resource-level checks.
// For all other roles, permission must exist in the RoleAccess collection.
const authorizeResource = (resourceName, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new ApiError(401, "Authentication required"));
      }

      // SUPER_ADMIN has unrestricted access
      if (req.user.role === "SUPER_ADMIN") {
        return next();
      }

      const access = await RoleAccess.findOne({
        role: req.user.role,
        resource: resourceName,
      });

      if (!access || !access.actions.includes(action)) {
        return next(
          new ApiError(403, `You do not have permission to ${action} on ${resourceName}`)
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { authorize, authorizeResource };
