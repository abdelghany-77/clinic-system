import { Stethoscope, Bluetooth as Tooth, Brain, Heart, Bone, Microscope, Activity } from 'lucide-react';
import { Appointment } from '../types/appointment';
import { MedicalRecord } from '../types/medicalRecord';

// Mock clinic types
export const mockClinicTypes = [
  {
    id: 1,
    name: 'General Medicine',
    description: 'For common illnesses and check-ups',
    icon: Stethoscope
  },
  {
    id: 2,
    name: 'Dental Clinic',
    description: 'For tooth and gum treatments',
    icon: Tooth
  },
  {
    id: 3,
    name: 'Neurology',
    description: 'For brain and nervous system issues',
    icon: Brain
  },
  {
    id: 4,
    name: 'Cardiology',
    description: 'For heart and cardiovascular conditions',
    icon: Heart
  },
  {
    id: 5,
    name: 'Orthopedics',
    description: 'For bone and joint problems',
    icon: Bone
  },
  {
    id: 6,
    name: 'Pathology',
    description: 'For diagnostic testing and lab work',
    icon: Microscope
  }
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 2,
    patientName: 'John Doe',
    patientAge: 35,
    doctorId: 1,
    doctorName: 'Smith',
    clinicType: 'General Medicine',
    healthCondition: 'Persistent cough and mild fever',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    time: '10:30 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'John Doe',
    patientAge: 35,
    doctorId: 3,
    doctorName: 'Johnson',
    clinicType: 'Dental Clinic',
    healthCondition: 'Tooth pain and sensitivity',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    time: '11:00 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    patientId: 2,
    patientName: 'John Doe',
    patientAge: 35,
    doctorId: 1,
    doctorName: 'Smith',
    clinicType: 'General Medicine',
    healthCondition: 'Routine check-up',
    date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    time: '10:00 AM',
    status: 'completed',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString()
  }
];

// Mock medical records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patientId: 2,
    doctorId: 1,
    healthCondition: 'Acute upper respiratory infection',
    medications: [
      'Paracetamol 500mg, take 1 tablet every 6 hours as needed',
      'Amoxicillin 500mg, take 1 capsule three times daily for 7 days'
    ],
    doctorNotes: 'Patient presented with cough and fever for 3 days. Throat appears red and inflamed. Lungs clear on auscultation. Likely viral infection with possible secondary bacterial component. Follow up in one week if symptoms persist.',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    nextAppointment: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString()
  }
];