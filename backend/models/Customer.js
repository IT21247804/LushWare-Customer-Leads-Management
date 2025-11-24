const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["call", "email", "meeting", "note"],
    default: "note",
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const projectHistorySchema = new mongoose.Schema({
  projectName: String,
  description: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["ongoing", "completed", "cancelled"],
  },
});

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Customer or company name
    email: { type: String },
    phone: { type: String },
    companyName: { type: String },
    address: { type: String },

    // Important: single main contact person
    contactPerson: {
      name: String,
      email: String,
      phone: String,
      position: String,
    },

    // Communication logs
    communicationLogs: [communicationLogSchema],

    // Past or active projects
    projectHistory: [projectHistorySchema],

    // Optional: uploaded files
    documents: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
        public_id: String,
        // delete_token: String,
      },
    ],

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Customer", customerSchema);