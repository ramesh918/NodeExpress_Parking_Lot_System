const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle reference is required"],
    },

    parkingSpotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpot",
      required: [true, "Parking spot reference is required"],
    },

    entryTime: {
      type: Date,
      default: Date.now,
    },

    exitTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "COMPLETED"],
        message: "Status must be ACTIVE or COMPLETED",
      },
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
