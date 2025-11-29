import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Activity,
  Clipboard,
  Users,
  ChevronRight,
  TrendingUp,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { appointmentAPI } from "../../services/api";
import { Appointment } from "../../types/appointment";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [stats, setStats] = useState({
    todayPatients: 0,
    weeklyPatients: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getAll();
        if (response.data.success) {
          const allAppointments = response.data.appointments;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Only show scheduled appointments (not cancelled or completed)
          const scheduledAppointments = allAppointments.filter(
            (app: any) => app.status === "scheduled"
          );

          const todayAppts = scheduledAppointments
            .filter((app: any) => {
              const appDate = new Date(app.date);
              appDate.setHours(0, 0, 0, 0);
              return appDate.getTime() === today.getTime();
            })
            .sort((a: any, b: any) => a.time.localeCompare(b.time));

          const upcoming = scheduledAppointments
            .filter((app: any) => {
              const appDate = new Date(app.date);
              appDate.setHours(0, 0, 0, 0);
              return appDate.getTime() > today.getTime();
            })
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 5);

          setTodayAppointments(todayAppts);
          setUpcomingAppointments(upcoming);

          setStats({
            todayPatients: todayAppts.length,
            weeklyPatients: scheduledAppointments.length,
            pendingAppointments: upcoming.length,
          });
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">
            Doctor Portal
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome,{" "}
          {user?.name?.startsWith("Dr.")
            ? user?.name
            : `Dr. ${user?.name?.split(" ")[0]}`}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your schedule and patient overview for today
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card border-primary-500 animate-slideUp">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Patients
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.todayPatients}
              </p>
              <p className="text-xs text-accent-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Active today
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="stat-card border-accent-500 animate-slideUp stagger-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.weeklyPatients}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total appointments</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-xl">
              <Activity className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="stat-card border-purple-500 animate-slideUp stagger-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.pendingAppointments}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pending visits</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="card p-6 lg:col-span-2 animate-slideUp stagger-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-primary-100 rounded-lg">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              Today's Schedule
            </h2>
            <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex bg-gray-50 rounded-xl overflow-hidden hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-center justify-center bg-primary-100 px-4 py-3 min-w-[80px]">
                    <p className="text-primary-800 font-bold text-sm">
                      {appointment.time}
                    </p>
                  </div>
                  <div className="flex-1 p-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientName}
                        <span className="text-gray-500 font-normal ml-1">
                          ({appointment.patientAge} yrs)
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {appointment.clinicType}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                        {appointment.healthCondition}
                      </p>
                    </div>
                    <Link
                      to={`/doctor/patient/${appointment.patientId}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
              <Link
                to="/doctor/appointments"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors mt-2"
              >
                View all appointments
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No appointments for today
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Enjoy your free time!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6 animate-slideUp stagger-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            Upcoming
          </h2>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900 text-sm">
                      {appointment.patientName}
                    </p>
                    <span className="text-xs font-medium px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                      {appointment.clinicType}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(appointment.date)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appointment.time}
                    </span>
                  </div>
                </div>
              ))}
              <Link
                to="/doctor/appointments"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View calendar
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp stagger-4">
        <Link
          to="/doctor/patients"
          className="card p-5 flex items-center hover:shadow-card-hover transition-all group"
        >
          <div className="p-3 rounded-xl bg-primary-100 mr-4 group-hover:bg-primary-200 transition-colors">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Patient Records</h3>
            <p className="text-sm text-gray-500">View and manage patients</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
        </Link>

        <Link
          to="/doctor/appointments"
          className="card p-5 flex items-center hover:shadow-card-hover transition-all group"
        >
          <div className="p-3 rounded-xl bg-accent-100 mr-4 group-hover:bg-accent-200 transition-colors">
            <Calendar className="h-6 w-6 text-accent-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-500">Manage your calendar</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-accent-600 transition-colors" />
        </Link>

        <Link
          to="/doctor/profile"
          className="card p-5 flex items-center hover:shadow-card-hover transition-all group"
        >
          <div className="p-3 rounded-xl bg-purple-100 mr-4 group-hover:bg-purple-200 transition-colors">
            <Clipboard className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Settings</h3>
            <p className="text-sm text-gray-500">Update preferences</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard;
