const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    healthCondition: {
      type: String,
      required: [true, "Please provide the health condition"],
    },
    medications: [
      {
        type: String,
      },
    ],
    doctorNotes: {
      type: String,
    },
    nextAppointment: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctorId: 1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
