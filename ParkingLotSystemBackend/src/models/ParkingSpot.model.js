const mongoose = require("mongoose");

const parkingSpotSchema = new mongoose.Schema(
  {
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
      required: [true, "Parking lot reference is required"],
    },

    spotNumber: {
      type: String,
      required: [true, "Spot number is required"],
      trim: true,
    },

    spotType: {
      type: String,
      enum: {
        values: ["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"],
        message: "Spot type must be TWO_WHEELER, THREE_WHEELER, or FOUR_WHEELER",
      },
      required: [true, "Spot type is required"],
    },

    isOccupied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Each spot number must be unique within a parking lot
parkingSpotSchema.index({ parkingLotId: 1, spotNumber: 1 }, { unique: true });

module.exports = mongoose.model("ParkingSpot", parkingSpotSchema);
