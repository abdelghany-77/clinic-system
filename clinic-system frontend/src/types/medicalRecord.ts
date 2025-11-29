export interface MedicalRecord {
  id?: number;
  _id?: string;
  patientId:
    | number
    | string
    | { _id: string; name: string; email: string; age: number };
  doctorId: number | string | { _id: string; name: string };
  healthCondition: string;
  medications: string[];
  doctorNotes: string;
  createdAt: string;
  updatedAt: string;
  nextAppointment?: string;
}
