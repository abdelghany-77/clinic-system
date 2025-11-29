const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    clinicType: {
      type: String,
      required: true,
    },
    healthCondition: {
      type: String,
      required: [true, "Please describe your health condition"],
    },
    date: {
      type: Date,
      required: [true, "Please select a date"],
    },
    time: {
      type: String,
      required: [true, "Please select a time"],
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
