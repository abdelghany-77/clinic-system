const mongoose = require("mongoose");

const clinicTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "Stethoscope",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClinicType", clinicTypeSchema);
