const Appointment = require("../models/Appointment");
const User = require("../models/User");

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
exports.createAppointment = async (req, res) => {
  try {
    const { clinicType, healthCondition, date, time, doctorId } = req.body;

    const patient = await User.findById(req.user.id);

    // Find doctor - if doctorId provided, use it; otherwise find first available doctor
    let doctor;
    if (doctorId) {
      doctor = await User.findById(doctorId);
    } else {
      doctor = await User.findOne({ role: "doctor" });
    }

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "No doctor available",
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      patientName: patient.name,
      patientAge: patient.age,
      doctorId: doctor._id,
      doctorName: doctor.name,
      clinicType,
      healthCondition,
      date,
      time,
      status: "scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("CreateAppointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all appointments for current user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    // If patient, get their appointments
    // If doctor, get appointments assigned to them
    if (req.user.role === "patient") {
      query.patientId = req.user.id;
    } else if (req.user.role === "doctor") {
      query.doctorId = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .sort({ date: 1, time: 1 })
      .populate("patientId", "name email age")
      .populate("doctorId", "name email specialization");

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("GetAppointments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get appointments by date (for doctors)
// @route   GET /api/appointments/date/:date
// @access  Private (Doctor only)
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const dateStr = req.params.date;
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    endDate.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ time: 1 })
      .populate("patientId", "name email age");

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("GetAppointmentsByDate error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email age")
      .populate("doctorId", "name email specialization");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check authorization
    if (
      req.user.role === "patient" &&
      appointment.patientId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("GetAppointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const { status, date, time } = req.body;

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check authorization - doctors can update any appointment, patients only their own
    if (
      req.user.role === "patient" &&
      appointment.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update fields
    if (status) appointment.status = status;
    if (date) appointment.date = date;
    if (time) appointment.time = time;

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("UpdateAppointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check authorization
    if (
      req.user.role === "patient" &&
      appointment.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("CancelAppointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get patient's appointments (for doctors)
// @route   GET /api/appointments/patient/:patientId
// @access  Private (Doctor only)
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    })
      .sort({ date: -1 })
      .populate("doctorId", "name specialization");

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("GetPatientAppointments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get booked time slots for a date
// @route   GET /api/appointments/booked-slots/:date
// @access  Private (Any authenticated user)
exports.getBookedSlots = async (req, res) => {
  try {
    const dateStr = req.params.date;
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    endDate.setHours(23, 59, 59, 999);

    // Find all appointments for the date that are not cancelled
    const appointments = await Appointment.find({
      date: { $gte: startDate, $lte: endDate },
      status: { $ne: "cancelled" },
    }).select("time");

    // Extract booked time slots
    const bookedSlots = appointments.map((apt) => apt.time);

    res.json({
      success: true,
      date: dateStr,
      bookedSlots,
    });
  } catch (error) {
    console.error("GetBookedSlots error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
