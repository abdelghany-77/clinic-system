const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load models
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const ClinicType = require("../models/ClinicType");

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Seed data
const clinicTypes = [
  {
    name: "General Medicine",
    description: "For common illnesses and check-ups",
    icon: "Stethoscope",
  },
  {
    name: "Dental Clinic",
    description: "For tooth and gum treatments",
    icon: "Tooth",
  },
  {
    name: "Neurology",
    description: "For brain and nervous system issues",
    icon: "Brain",
  },
  {
    name: "Cardiology",
    description: "For heart and cardiovascular conditions",
    icon: "Heart",
  },
  {
    name: "Orthopedics",
    description: "For bone and joint problems",
    icon: "Bone",
  },
  {
    name: "Pathology",
    description: "For diagnostic testing and lab work",
    icon: "Microscope",
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    await ClinicType.deleteMany({});

    console.log("Cleared existing data...");

    // Create clinic types
    await ClinicType.insertMany(clinicTypes);
    console.log("Clinic types seeded...");

    // Create doctor user
    const doctor = await User.create({
      name: "Dr. Smith",
      email: "doctor@example.com",
      password: "password",
      role: "doctor",
      specialization: "General Medicine",
      phone: "555-111-2222",
    });
    console.log("Doctor created...");

    // Create another doctor
    const doctor2 = await User.create({
      name: "Dr. Johnson",
      email: "johnson@example.com",
      password: "password",
      role: "doctor",
      specialization: "Dental Clinic",
      phone: "555-333-4444",
    });
    console.log("Second doctor created...");

    // Create patient user
    const patient = await User.create({
      name: "John Doe",
      email: "patient@example.com",
      password: "password",
      age: 35,
      role: "patient",
      phone: "555-123-4567",
      address: "123 Main St, Anytown, AN 12345",
      emergencyContact: {
        name: "Jane Doe",
        phone: "555-987-6543",
      },
      allergies: "Penicillin",
      medicalHistory: "Hypertension, Asthma",
    });
    console.log("Patient created...");

    // Create appointments
    const today = new Date();

    const appointments = [
      {
        patientId: patient._id,
        patientName: patient.name,
        patientAge: patient.age,
        doctorId: doctor._id,
        doctorName: doctor.name,
        clinicType: "General Medicine",
        healthCondition: "Persistent cough and mild fever",
        date: new Date(today.setDate(today.getDate() + 3)),
        time: "10:30 AM",
        status: "scheduled",
      },
      {
        patientId: patient._id,
        patientName: patient.name,
        patientAge: patient.age,
        doctorId: doctor2._id,
        doctorName: doctor2.name,
        clinicType: "Dental Clinic",
        healthCondition: "Tooth pain and sensitivity",
        date: new Date(new Date().setDate(new Date().getDate() + 7)),
        time: "11:00 AM",
        status: "scheduled",
      },
      {
        patientId: patient._id,
        patientName: patient.name,
        patientAge: patient.age,
        doctorId: doctor._id,
        doctorName: doctor.name,
        clinicType: "General Medicine",
        healthCondition: "Routine check-up",
        date: new Date(new Date().setDate(new Date().getDate() - 14)),
        time: "10:00 AM",
        status: "completed",
      },
    ];

    await Appointment.insertMany(appointments);
    console.log("Appointments seeded...");

    // Create medical record
    const medicalRecord = await MedicalRecord.create({
      patientId: patient._id,
      doctorId: doctor._id,
      healthCondition: "Acute upper respiratory infection",
      medications: [
        "Paracetamol 500mg, take 1 tablet every 6 hours as needed",
        "Amoxicillin 500mg, take 1 capsule three times daily for 7 days",
      ],
      doctorNotes:
        "Patient presented with cough and fever for 3 days. Throat appears red and inflamed. Lungs clear on auscultation. Likely viral infection with possible secondary bacterial component. Follow up in one week if symptoms persist.",
      nextAppointment: new Date(new Date().setDate(new Date().getDate() + 3)),
    });
    console.log("Medical record seeded...");

    console.log("\n========================================");
    console.log("Database seeded successfully!");
    console.log("========================================");
    console.log("\nTest accounts:");
    console.log("Doctor: doctor@example.com / password");
    console.log("Patient: patient@example.com / password");
    console.log("========================================\n");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
