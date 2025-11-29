const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByDate,
  getPatientAppointments,
  getBookedSlots,
} = require("../controllers/appointment.controller");
const { protect, authorize } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Patient routes
router.post("/", authorize("patient"), createAppointment);

// Get booked slots for a date (any authenticated user)
router.get("/booked-slots/:date", getBookedSlots);

// Common routes
router.get("/", getAppointments);
router.get("/:id", getAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", cancelAppointment);

// Doctor routes
router.get("/date/:date", authorize("doctor"), getAppointmentsByDate);
router.get("/patient/:patientId", authorize("doctor"), getPatientAppointments);

module.exports = router;
