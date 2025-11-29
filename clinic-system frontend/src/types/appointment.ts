export interface Appointment {
  id?: number;
  _id?: string;
  patientId:
    | number
    | string
    | { _id: string; name: string; email: string; age: number };
  patientName: string;
  patientAge: number;
  doctorId: number | string | { _id: string; name: string; email: string };
  doctorName: string;
  clinicType: string;
  healthCondition: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
