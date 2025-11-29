const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");

// @desc    Create new medical record
// @route   POST /api/medical-records
// @access  Private (Doctor only)
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      healthCondition,
      medications,
      doctorNotes,
      nextAppointment,
    } = req.body;

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const medicalRecord = await MedicalRecord.create({
      patientId,
      doctorId: req.user.id,
      healthCondition,
      medications,
      doctorNotes,
      nextAppointment,
    });

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      medicalRecord,
    });
  } catch (error) {
    console.error("CreateMedicalRecord error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all medical records for current patient
// @route   GET /api/medical-records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
  try {
    let query = {};

    // Patients can only see their own records
    // Doctors can see all records they created
    if (req.user.role === "patient") {
      query.patientId = req.user.id;
    } else if (req.user.role === "doctor") {
      query.doctorId = req.user.id;
    }

    const medicalRecords = await MedicalRecord.find(query)
      .sort({ updatedAt: -1 })
      .populate("patientId", "name email age")
      .populate("doctorId", "name specialization");

    res.json({
      success: true,
      count: medicalRecords.length,
      medicalRecords,
    });
  } catch (error) {
    console.error("GetMedicalRecords error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get patient's medical records (for doctors)
// @route   GET /api/medical-records/patient/:patientId
// @access  Private (Doctor only)
exports.getPatientMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({
      patientId: req.params.patientId,
    })
      .sort({ updatedAt: -1 })
      .populate("doctorId", "name specialization");

    res.json({
      success: true,
      count: medicalRecords.length,
      medicalRecords,
    });
  } catch (error) {
    console.error("GetPatientMedicalRecords error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
exports.getMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate("patientId", "name email age")
      .populate("doctorId", "name specialization");

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    // Check authorization for patients
    if (
      req.user.role === "patient" &&
      medicalRecord.patientId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      medicalRecord,
    });
  } catch (error) {
    console.error("GetMedicalRecord error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor only)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { healthCondition, medications, doctorNotes, nextAppointment } =
      req.body;

    let medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    // Update fields
    if (healthCondition) medicalRecord.healthCondition = healthCondition;
    if (medications) medicalRecord.medications = medications;
    if (doctorNotes !== undefined) medicalRecord.doctorNotes = doctorNotes;
    if (nextAppointment !== undefined)
      medicalRecord.nextAppointment = nextAppointment;

    await medicalRecord.save();

    res.json({
      success: true,
      message: "Medical record updated successfully",
      medicalRecord,
    });
  } catch (error) {
    console.error("UpdateMedicalRecord error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private (Doctor only)
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    await medicalRecord.deleteOne();

    res.json({
      success: true,
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    console.error("DeleteMedicalRecord error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
