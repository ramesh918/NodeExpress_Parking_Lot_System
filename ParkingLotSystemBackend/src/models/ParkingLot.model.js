const mongoose = require("mongoose");

const parkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Parking lot name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    totalSpots: {
      type: Number,
      required: [true, "Total spots is required"],
      min: [1, "Total spots must be at least 1"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParkingLot", parkingLotSchema);
