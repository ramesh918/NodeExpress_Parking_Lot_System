const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: [true, "Ticket reference is required"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    status: {
      type: String,
      enum: {
        values: ["PENDING", "PAID"],
        message: "Status must be PENDING or PAID",
      },
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
