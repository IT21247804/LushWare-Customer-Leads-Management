const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["website", "facebook", "instagram", "google-ads", "referral", "manual", "other"],
      default: "manual",
    },

    status: {
      type: String,
      enum: ["new", "in-progress", "converted", "lost"],
      default: "new",
    },
    
     priority: {
      type: String,
      enum: ["hot", "warm", "cold"],
      default: "warm",
    },

    convertedAt: {
      type: Date,
    },

    // Optional meta fields
    assignedTo: {
      type: String, // could be userId in the future
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
