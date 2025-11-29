import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Activity,
  FileText,
  ChevronRight,
  UserRound,
  Sparkles,
  Heart,
  Droplets,
  Dumbbell,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { appointmentAPI, medicalRecordAPI } from "../../services/api";

// Types
import { Appointment } from "../../types/appointment";
import { MedicalRecord } from "../../types/medicalRecord";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [latestRecord, setLatestRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentsRes = await appointmentAPI.getAll();
        if (appointmentsRes.data.success) {
          const appointments = appointmentsRes.data.appointments
            .filter(
              (app: any) =>
                new Date(app.date) >= new Date() && app.status === "scheduled"
            )
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 2);
          setUpcomingAppointments(appointments);
        }

        // Fetch medical records
        const recordsRes = await medicalRecordAPI.getAll();
        if (
          recordsRes.data.success &&
          recordsRes.data.medicalRecords.length > 0
        ) {
          setLatestRecord(recordsRes.data.medicalRecords[0]);
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
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your health summary and upcoming appointments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Status Card */}
          <div className="card p-6 animate-slideUp">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-accent-100 rounded-lg">
                  <Activity className="h-4 w-4 text-accent-600" />
                </div>
                Health Overview
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-accent-100 text-accent-700 rounded-full">
                Latest
              </span>
            </div>

            {latestRecord ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Current Condition
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {latestRecord.healthCondition}
                  </p>
                </div>

                {latestRecord.medications &&
                  latestRecord.medications.length > 0 && (
                    <div className="p-4 bg-primary-50 rounded-xl">
                      <h3 className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
                        Current Medications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {latestRecord.medications.map((med, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white text-primary-700 text-sm rounded-full border border-primary-200"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {latestRecord.doctorNotes && (
                  <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                    <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                      Doctor's Notes
                    </h3>
                    <p className="text-gray-700">{latestRecord.doctorNotes}</p>
                  </div>
                )}

                <Link
                  to="/patient/medical-records"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View all records
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No medical records yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Your records will appear here after your first visit
                </p>
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="card p-6 animate-slideUp stagger-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-primary-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary-600" />
                </div>
                Upcoming Appointments
              </h2>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gradient-to-r from-primary-50 to-white rounded-xl border border-primary-100 hover:shadow-soft transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center bg-white rounded-lg px-3 py-2 border border-primary-200 min-w-[60px]">
                          <span className="text-xs font-medium text-primary-600 uppercase">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              { month: "short" }
                            )}
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            {new Date(appointment.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {appointment.clinicType}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Dr. {appointment.doctorName}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-accent-100 text-accent-700 rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
                <Link
                  to="/patient/book-appointment"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors mt-2"
                >
                  Book new appointment
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No upcoming appointments
                </p>
                <Link
                  to="/patient/book-appointment"
                  className="btn-primary mt-4 text-sm"
                >
                  Book an appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6 animate-slideUp stagger-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                to="/patient/book-appointment"
                className="flex items-center p-3.5 rounded-xl bg-primary-50 text-primary-700 font-medium transition-all hover:bg-primary-100 hover:shadow-soft group"
              >
                <div className="p-2 bg-primary-100 rounded-lg mr-3 group-hover:bg-primary-200 transition-colors">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>Book Appointment</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/patient/medical-records"
                className="flex items-center p-3.5 rounded-xl bg-accent-50 text-accent-700 font-medium transition-all hover:bg-accent-100 hover:shadow-soft group"
              >
                <div className="p-2 bg-accent-100 rounded-lg mr-3 group-hover:bg-accent-200 transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <span>Medical Records</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/patient/profile"
                className="flex items-center p-3.5 rounded-xl bg-purple-50 text-purple-700 font-medium transition-all hover:bg-purple-100 hover:shadow-soft group"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                  <UserRound className="h-5 w-5" />
                </div>
                <span>Update Profile</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Health Tips */}
          <div className="card p-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white animate-slideUp stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Daily Health Tips</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Droplets className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Drink at least 8 glasses of water daily for optimal hydration
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Dumbbell className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  30 minutes of daily activity boosts your immune system
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Take medications on time as prescribed by your doctor
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
