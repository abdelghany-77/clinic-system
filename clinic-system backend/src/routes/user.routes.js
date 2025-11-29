const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDoctors,
  getPatients,
  getPatientById,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// User profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Doctor routes
router.get("/doctors", getDoctors);

// Patient routes (doctors only)
router.get("/patients", authorize("doctor"), getPatients);
router.get("/patients/:id", authorize("doctor"), getPatientById);

module.exports = router;
