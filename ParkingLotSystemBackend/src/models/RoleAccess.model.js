const mongoose = require("mongoose");

const roleAccessSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: {
        values: ["SUPER_ADMIN", "ADMIN", "USER"],
        message: "Role must be SUPER_ADMIN, ADMIN, or USER",
      },
      required: [true, "Role is required"],
    },

    resource: {
      type: String,
      required: [true, "Resource is required"],
      trim: true,
    },

    actions: {
      type: [String],
      enum: {
        values: ["CREATE", "READ", "UPDATE", "DELETE"],
        message: "Action must be CREATE, READ, UPDATE, or DELETE",
      },
      default: [],
    },
  },
  { timestamps: true }
);

// Each role can only have one entry per resource
roleAccessSchema.index({ role: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model("RoleAccess", roleAccessSchema);
