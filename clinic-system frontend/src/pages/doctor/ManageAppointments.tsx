import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  Stethoscope,
  Printer,
} from "lucide-react";
import { appointmentAPI } from "../../services/api";
import { Appointment } from "../../types/appointment";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const ManageAppointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments on mount
  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const response = await appointmentAPI.getAll();
        if (response.data.success) {
          setAllAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments for the selected date (only show scheduled appointments)
    setLoading(true);

    const filteredApps = allAppointments
      .filter((app) => {
        const appDate = new Date(app.date);
        return (
          appDate.getDate() === selectedDate.getDate() &&
          appDate.getMonth() === selectedDate.getMonth() &&
          appDate.getFullYear() === selectedDate.getFullYear() &&
          app.status === "scheduled"
        );
      })
      .sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

    setAppointments(filteredApps);
    setLoading(false);
  }, [selectedDate, allAppointments]);

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Generate days for the calendar
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Create an array for all days in the month
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if a date has appointments
  const hasAppointments = (date: Date) => {
    return allAppointments.some((app) => {
      const appDate = new Date(app.date);
      return (
        appDate.getDate() === date.getDate() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle appointment status update
  const handleStatusUpdate = async (
    appointmentId: number | string,
    status: "completed" | "cancelled"
  ) => {
    try {
      const response = await appointmentAPI.update(appointmentId.toString(), {
        status,
      });

      if (response.data.success) {
        // Update local state
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === appointmentId || app._id === appointmentId
              ? { ...app, status }
              : app
          )
        );
        setAllAppointments((prev) =>
          prev.map((app) =>
            app.id === appointmentId || app._id === appointmentId
              ? { ...app, status }
              : app
          )
        );

        toast.success(
          `Appointment ${
            status === "completed" ? "marked as completed" : "cancelled"
          }`
        );
      } else {
        toast.error(response.data.message || "Failed to update appointment");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">Schedule</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Appointments
        </h1>
        <p className="text-gray-500">
          View and manage your appointment schedule
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="card p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
              title="Previous month"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {formatMonth(currentDate)}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Next month"
              title="Next month"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="text-center text-xs font-semibold text-gray-400 py-2 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-10"></div>;
              }

              const date = day as Date;
              const hasApps = hasAppointments(date);

              return (
                <div
                  key={`day-${index}`}
                  onClick={() => setSelectedDate(date)}
                  className={`h-10 flex items-center justify-center cursor-pointer rounded-xl transition-all duration-200 relative font-medium ${
                    isDateSelected(date)
                      ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft"
                      : isToday(date)
                      ? "text-primary-600 font-bold bg-primary-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {date.getDate()}
                  {hasApps && !isDateSelected(date) && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Selected Date
            </h3>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 p-4 rounded-xl border border-primary-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary-700" />
                </div>
                <span className="font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                <span>Has appointments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments for selected date */}
        <div className="card p-6 lg:col-span-2 animate-slideUp stagger-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-primary-100 rounded-lg">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              Appointments for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </h2>

            <button className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
              <Printer className="h-4 w-4" />
              Print Schedule
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id || appointment.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors"
                >
                  <div className="flex">
                    {/* Time column */}
                    <div className="bg-gradient-to-b from-primary-100 to-primary-50 text-primary-800 p-4 flex flex-col items-center justify-center w-24 border-r border-primary-100">
                      <Clock className="h-5 w-5 mb-1" />
                      <span className="font-bold">{appointment.time}</span>
                    </div>

                    {/* Content column */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">
                              {appointment.patientName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Age: {appointment.patientAge}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 md:mt-0 flex items-center gap-3">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {appointment.clinicType}
                          </span>

                          <Link
                            to={`/doctor/patient/${
                              typeof appointment.patientId === "object"
                                ? appointment.patientId._id
                                : appointment.patientId
                            }`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            View Record →
                          </Link>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                        {appointment.healthCondition}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id || appointment.id,
                              "completed"
                            )
                          }
                          className="inline-flex items-center px-3 py-2 border-2 border-accent-600 text-xs font-medium rounded-lg text-accent-700 bg-accent-50 hover:bg-accent-100 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Mark Completed
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id || appointment.id,
                              "cancelled"
                            )
                          }
                          className="inline-flex items-center px-3 py-2 border-2 border-red-500 text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                          Cancel
                        </button>

                        <button className="inline-flex items-center px-3 py-2 border-2 border-purple-500 text-xs font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors">
                          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <div className="p-4 bg-gray-100 rounded-2xl w-fit mx-auto mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-gray-600 text-lg font-medium mb-1">
                No Appointments
              </h3>
              <p className="text-gray-400">
                There are no appointments scheduled for this date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
