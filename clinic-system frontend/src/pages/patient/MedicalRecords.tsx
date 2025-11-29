import { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Pill,
  ClipboardList,
  Heart,
  Clock,
  Stethoscope,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { medicalRecordAPI, appointmentAPI } from "../../services/api";
import { MedicalRecord } from "../../types/medicalRecord";
import { Appointment } from "../../types/appointment";

const ViewMedicalRecords = () => {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch medical records
        const recordsRes = await medicalRecordAPI.getAll();
        if (recordsRes.data.success) {
          setMedicalRecords(recordsRes.data.medicalRecords);
        }

        // Fetch appointments
        const appointmentsRes = await appointmentAPI.getAll();
        if (appointmentsRes.data.success) {
          const upcoming = appointmentsRes.data.appointments
            .filter(
              (app: any) =>
                new Date(app.date) >= new Date() && app.status === "scheduled"
            )
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
          setUpcomingAppointments(upcoming);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">
            Health Records
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-500">
          View your health history, medications, and doctor's notes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - medical records */}
        <div className="lg:col-span-2">
          {medicalRecords.length > 0 ? (
            <div className="space-y-6">
              {medicalRecords.map((record, index) => (
                <div
                  key={record.id}
                  className={`card overflow-hidden animate-slideUp ${
                    index > 0 ? "stagger-1" : ""
                  }`}
                >
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-xl">
                          <Calendar className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Visit Record
                          </h2>
                          <p className="text-sm text-gray-500">
                            {formatDate(record.updatedAt)}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary-500" />
                        Health Condition
                      </h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {record.healthCondition}
                      </p>
                    </div>

                    {record.medications && record.medications.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Pill className="h-4 w-4 text-accent-600" />
                          Prescribed Medications
                        </h3>
                        <div className="space-y-2">
                          {record.medications.map((med, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-accent-50 text-accent-800 px-4 py-3 rounded-xl border border-accent-100"
                            >
                              <CheckCircle className="h-4 w-4 text-accent-600 flex-shrink-0" />
                              <span className="font-medium">{med}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.doctorNotes && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-purple-500" />
                          Doctor's Notes & Instructions
                        </h3>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                          <p className="text-purple-900">
                            {record.doctorNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {record.nextAppointment && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary-500" />
                          Follow-up Appointment
                        </h3>
                        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-800 px-4 py-2 rounded-xl border border-primary-100">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {formatDate(record.nextAppointment)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center animate-slideUp">
              <div className="p-4 bg-gray-100 rounded-2xl w-fit mx-auto mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No medical records yet
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                Your medical history will appear here after your first visit to
                the clinic.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="card p-6 animate-slideUp">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary-100 rounded-lg">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              Upcoming Appointments
            </h2>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border-l-4 border-primary-500 pl-4 py-3 bg-gray-50 rounded-r-xl"
                  >
                    <p className="font-semibold text-gray-900">
                      {formatDate(appointment.date)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                      <Stethoscope className="h-3.5 w-3.5" />
                      {appointment.clinicType}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No upcoming appointments
                </p>
              </div>
            )}
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl shadow-soft p-6 animate-slideUp stagger-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Health Reminders
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Pill className="h-4 w-4 text-primary-200" />
                </div>
                <span className="text-sm text-primary-100">
                  Take medications as prescribed by your doctor
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Calendar className="h-4 w-4 text-primary-200" />
                </div>
                <span className="text-sm text-primary-100">
                  Keep all follow-up appointments
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle className="h-4 w-4 text-primary-200" />
                </div>
                <span className="text-sm text-primary-100">
                  Contact the clinic if your symptoms worsen
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicalRecords;
