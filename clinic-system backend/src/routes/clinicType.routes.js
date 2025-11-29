const express = require("express");
const router = express.Router();
const {
  getClinicTypes,
  createClinicType,
  updateClinicType,
  deleteClinicType,
} = require("../controllers/clinicType.controller");
const { protect, authorize } = require("../middleware/auth");

// Public route
router.get("/", getClinicTypes);

// Protected routes (Doctor only)
router.post("/", protect, authorize("doctor"), createClinicType);
router.put("/:id", protect, authorize("doctor"), updateClinicType);
router.delete("/:id", protect, authorize("doctor"), deleteClinicType);

module.exports = router;
