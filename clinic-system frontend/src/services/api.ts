import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    age: number;
    password: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.get("/auth/logout"),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.put("/users/profile", data),
  getDoctors: () => api.get("/users/doctors"),
  getPatients: () => api.get("/users/patients"),
  getPatientById: (id: string) => api.get(`/users/patients/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data: {
    clinicType: string;
    healthCondition: string;
    date: string;
    time: string;
    doctorId?: string;
  }) => api.post("/appointments", data),
  getAll: () => api.get("/appointments"),
  getById: (id: string) => api.get(`/appointments/${id}`),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
  getByDate: (date: string) => api.get(`/appointments/date/${date}`),
  getPatientAppointments: (patientId: string) =>
    api.get(`/appointments/patient/${patientId}`),
  getBookedSlots: (date: string) =>
    api.get(`/appointments/booked-slots/${date}`),
};

// Medical Record APIs
export const medicalRecordAPI = {
  create: (data: {
    patientId: string;
    healthCondition: string;
    medications: string[];
    doctorNotes?: string;
    nextAppointment?: string;
  }) => api.post("/medical-records", data),
  getAll: () => api.get("/medical-records"),
  getById: (id: string) => api.get(`/medical-records/${id}`),
  update: (id: string, data: any) => api.put(`/medical-records/${id}`, data),
  delete: (id: string) => api.delete(`/medical-records/${id}`),
  getPatientRecords: (patientId: string) =>
    api.get(`/medical-records/patient/${patientId}`),
};

// Clinic Type APIs
export const clinicTypeAPI = {
  getAll: () => api.get("/clinic-types"),
  create: (data: { name: string; description: string; icon?: string }) =>
    api.post("/clinic-types", data),
  update: (id: string, data: any) => api.put(`/clinic-types/${id}`, data),
  delete: (id: string) => api.delete(`/clinic-types/${id}`),
};

export default api;
