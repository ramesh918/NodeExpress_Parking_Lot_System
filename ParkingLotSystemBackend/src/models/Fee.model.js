const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      enum: {
        values: ["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"],
        message: "Vehicle type must be TWO_WHEELER, THREE_WHEELER, or FOUR_WHEELER",
      },
      required: [true, "Vehicle type is required"],
      unique: true,
    },

    baseFare: {
      type: Number,
      required: [true, "Base fare is required"],
      min: [0, "Base fare cannot be negative"],
    },

    ratePerHour: {
      type: Number,
      required: [true, "Rate per hour is required"],
      min: [0, "Rate per hour cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
