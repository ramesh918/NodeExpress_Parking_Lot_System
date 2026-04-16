const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    licensePlate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      enum: {
        values: ["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"],
        message: "Vehicle type must be TWO_WHEELER, THREE_WHEELER, or FOUR_WHEELER",
      },
      required: [true, "Vehicle type is required"],
    },

    make: {
      type: String,
      required: [true, "Vehicle make is required"],
      trim: true,
    },

    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true,
    },

    color: {
      type: String,
      required: [true, "Vehicle color is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
