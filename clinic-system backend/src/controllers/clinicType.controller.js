const ClinicType = require("../models/ClinicType");

// @desc    Get all clinic types
// @route   GET /api/clinic-types
// @access  Public
exports.getClinicTypes = async (req, res) => {
  try {
    const clinicTypes = await ClinicType.find().sort({ name: 1 });

    res.json({
      success: true,
      count: clinicTypes.length,
      clinicTypes,
    });
  } catch (error) {
    console.error("GetClinicTypes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create clinic type
// @route   POST /api/clinic-types
// @access  Private (Admin/Doctor only)
exports.createClinicType = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const existingType = await ClinicType.findOne({ name });
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: "Clinic type already exists",
      });
    }

    const clinicType = await ClinicType.create({
      name,
      description,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Clinic type created successfully",
      clinicType,
    });
  } catch (error) {
    console.error("CreateClinicType error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update clinic type
// @route   PUT /api/clinic-types/:id
// @access  Private (Admin/Doctor only)
exports.updateClinicType = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    let clinicType = await ClinicType.findById(req.params.id);

    if (!clinicType) {
      return res.status(404).json({
        success: false,
        message: "Clinic type not found",
      });
    }

    if (name) clinicType.name = name;
    if (description) clinicType.description = description;
    if (icon) clinicType.icon = icon;

    await clinicType.save();

    res.json({
      success: true,
      message: "Clinic type updated successfully",
      clinicType,
    });
  } catch (error) {
    console.error("UpdateClinicType error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete clinic type
// @route   DELETE /api/clinic-types/:id
// @access  Private (Admin/Doctor only)
exports.deleteClinicType = async (req, res) => {
  try {
    const clinicType = await ClinicType.findById(req.params.id);

    if (!clinicType) {
      return res.status(404).json({
        success: false,
        message: "Clinic type not found",
      });
    }

    await clinicType.deleteOne();

    res.json({
      success: true,
      message: "Clinic type deleted successfully",
    });
  } catch (error) {
    console.error("DeleteClinicType error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
