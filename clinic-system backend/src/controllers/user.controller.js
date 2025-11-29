const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        phone: user.phone,
        address: user.address,
        emergencyContact: user.emergencyContact,
        allergies: user.allergies,
        medicalHistory: user.medicalHistory,
        specialization: user.specialization,
      },
    });
  } catch (error) {
    console.error("GetProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, age, phone, address, emergencyContact } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        phone: user.phone,
        address: user.address,
        emergencyContact: user.emergencyContact,
        allergies: user.allergies,
        medicalHistory: user.medicalHistory,
      },
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("GetDoctors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all patients (for doctors)
// @route   GET /api/users/patients
// @access  Private (Doctor only)
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("GetPatients error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single patient by ID (for doctors)
// @route   GET /api/users/patients/:id
// @access  Private (Doctor only)
exports.getPatientById = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select("-password");

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("GetPatientById error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
