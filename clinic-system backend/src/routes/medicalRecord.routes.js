const express = require("express");
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getPatientMedicalRecords,
} = require("../controllers/medicalRecord.controller");
const { protect, authorize } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Common routes
router.get("/", getMedicalRecords);
router.get("/:id", getMedicalRecord);

// Doctor only routes
router.post("/", authorize("doctor"), createMedicalRecord);
router.put("/:id", authorize("doctor"), updateMedicalRecord);
router.delete("/:id", authorize("doctor"), deleteMedicalRecord);
router.get(
  "/patient/:patientId",
  authorize("doctor"),
  getPatientMedicalRecords
);

module.exports = router;
