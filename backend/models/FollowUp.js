const mongoose = require("mongoose");

const FollowUpSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    assignedTo: {
      type: String,
    },


    title: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
    },

    followUpDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },

    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUp", FollowUpSchema);
