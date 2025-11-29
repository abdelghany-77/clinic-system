import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FileText,
  User,
  ClipboardEdit,
  Calendar,
  Save,
  ArrowLeft,
  Plus,
  X,
  Pill,
  Stethoscope,
  Clock,
  Loader2,
} from "lucide-react";
import { userAPI, medicalRecordAPI } from "../../services/api";
import { MedicalRecord } from "../../types/medicalRecord";

const EditPatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = parseInt(id || "0");

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthCondition, setHealthCondition] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (patientId) {
        try {
          // Fetch patient info
          const patientRes = await userAPI.getPatientById(id || "");

          if (patientRes.data.success) {
            const patientData = patientRes.data.patient;
            setPatient({
              id: patientData._id,
              name: patientData.name,
              age: patientData.age,
              email: patientData.email,
            });
          }

          // Fetch patient's medical records
          const recordsRes = await medicalRecordAPI.getPatientRecords(id || "");

          if (recordsRes.data.success) {
            const records = recordsRes.data.medicalRecords.sort(
              (a: any, b: any) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );

            setMedicalHistory(records);

            // Pre-fill form with latest record if available
            if (records.length > 0) {
              const latest = records[0];
              setHealthCondition(latest.healthCondition || "");
              setMedications(latest.medications || []);
              setDoctorNotes(latest.doctorNotes || "");

              if (latest.nextAppointment) {
                const nextDate = new Date(latest.nextAppointment);
                setAppointmentDate(nextDate.toISOString().split("T")[0]);
                setAppointmentTime("10:00");
              }
            }
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [patientId, id]);

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await medicalRecordAPI.create({
        patientId: id || "",
        healthCondition,
        medications,
        doctorNotes,
        nextAppointment:
          appointmentDate && appointmentTime
            ? new Date(`${appointmentDate}T${appointmentTime}`).toISOString()
            : undefined,
      });

      if (response.data.success) {
        // Add to local state
        setMedicalHistory([response.data.medicalRecord, ...medicalHistory]);
        toast.success("Patient record updated successfully");
      } else {
        toast.error(response.data.message || "Failed to save record");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save record");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card p-6 border-l-4 border-red-500">
          <p className="text-red-700 font-medium">
            Patient not found. Please check the patient ID and try again.
          </p>
        </div>
        <button
          onClick={() => navigate("/doctor/patients")}
          className="mt-4 flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center animate-fadeIn">
        <button
          onClick={() => navigate("/doctor/patients")}
          className="mr-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Back to patient list"
          title="Back to patient list"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">
              Medical Records
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Record</h1>
          <p className="text-gray-500">
            Edit medical information for {patient.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information Sidebar */}
        <div className="card p-6 lg:col-span-1 animate-slideUp">
          <div className="flex items-center mb-6">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
              <span className="text-xl font-bold text-white">
                {patient.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">
                {patient.name}
              </h2>
              <p className="text-gray-500">{patient.age} years old</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm text-gray-700">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Last Visit
                </p>
                <p className="text-sm text-gray-700">
                  {medicalHistory.length > 0
                    ? new Date(medicalHistory[0].updatedAt).toLocaleDateString()
                    : "No previous visits"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Medical History
            </h3>

            {medicalHistory.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {medicalHistory.map((record, index) => (
                  <div
                    key={record.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(record.updatedAt).toLocaleDateString()}
                      </span>
                      {index === 0 && (
                        <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {record.healthCondition}
                    </p>
                    <button
                      onClick={() => {
                        setHealthCondition(record.healthCondition);
                        setMedications(record.medications);
                        setDoctorNotes(record.doctorNotes);
                      }}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Load this record →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No medical history</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="card p-6 lg:col-span-2 animate-slideUp stagger-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-1.5 bg-primary-100 rounded-lg">
              <ClipboardEdit className="h-4 w-4 text-primary-600" />
            </div>
            Update Medical Record
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Health Condition */}
            <div>
              <label
                htmlFor="healthCondition"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <Stethoscope className="h-4 w-4 text-gray-400" />
                Health Condition
              </label>
              <textarea
                id="healthCondition"
                rows={3}
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none resize-none"
                placeholder="Describe the patient's current health condition..."
                required
              ></textarea>
            </div>

            {/* Medications */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Pill className="h-4 w-4 text-gray-400" />
                Medications
              </label>
              <div className="mb-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddMedication())
                    }
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                    placeholder="Add medication and dosage (e.g., Amoxicillin 500mg)"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                    aria-label="Add medication"
                    title="Add medication"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {medications.length > 0 ? (
                  medications.map((medication, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-accent-50 p-3 rounded-xl border border-accent-100"
                    >
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-accent-600" />
                        <span className="text-gray-800 font-medium">
                          {medication}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={`Remove ${medication}`}
                        title={`Remove ${medication}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic py-3 text-center bg-gray-50 rounded-xl">
                    No medications added yet
                  </p>
                )}
              </div>
            </div>

            {/* Doctor's Notes */}
            <div>
              <label
                htmlFor="doctorNotes"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <FileText className="h-4 w-4 text-gray-400" />
                Doctor's Notes & Instructions
              </label>
              <textarea
                id="doctorNotes"
                rows={4}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none resize-none"
                placeholder="Add notes, recommendations, and instructions for the patient..."
              ></textarea>
            </div>

            {/* Schedule Next Appointment */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                Schedule Next Appointment
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"
                  >
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label
                    htmlFor="appointmentTime"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    Time
                  </label>
                  <select
                    id="appointmentTime"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select time</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/doctor/patients")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="btn-primary">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Record
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatientRecord;
