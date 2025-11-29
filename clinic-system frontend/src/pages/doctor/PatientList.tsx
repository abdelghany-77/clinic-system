import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  CalendarClock,
} from "lucide-react";
import { userAPI, appointmentAPI } from "../../services/api";

const PatientList = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">(
    "all"
  );

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsRes = await userAPI.getPatients();

        if (patientsRes.data.success) {
          const appointmentsRes = await appointmentAPI.getAll();
          const appointments = appointmentsRes.data.success
            ? appointmentsRes.data.appointments
            : [];

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const patientsWithAppointments = patientsRes.data.patients.map(
            (patient: any) => {
              const patientAppts = appointments.filter(
                (app: any) =>
                  app.patientId === patient._id ||
                  app.patientId?._id === patient._id
              );

              // Separate past and future appointments
              const pastAppts = patientAppts
                .filter((app: any) => new Date(app.date) < today)
                .sort(
                  (a: any, b: any) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

              const upcomingAppts = patientAppts
                .filter((app: any) => new Date(app.date) >= today)
                .sort(
                  (a: any, b: any) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );

              const lastVisit = pastAppts[0] || null;
              const nextAppointment = upcomingAppts[0] || null;

              return {
                id: patient._id,
                name: patient.name,
                age: patient.age,
                email: patient.email,
                lastVisitDate: lastVisit?.date || null,
                lastVisitCondition: lastVisit?.healthCondition || null,
                nextAppointmentDate: nextAppointment?.date || null,
                nextAppointmentTime: nextAppointment?.time || null,
                nextAppointmentCondition:
                  nextAppointment?.healthCondition || null,
                totalVisits: pastAppts.length,
                hasUpcoming: upcomingAppts.length > 0,
              };
            }
          );

          setPatients(patientsWithAppointments);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastVisitCondition
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.nextAppointmentCondition
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filterStatus === "upcoming")
      return matchesSearch && patient.hasUpcoming;
    if (filterStatus === "past")
      return matchesSearch && patient.totalVisits > 0;
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    return formatDate(dateString);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">
            Patient Management
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Patient Records
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and view detailed patient information
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-primary-50 text-primary-700"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("upcoming")}
                className={`px-3 py-2 text-sm font-medium transition-colors border-l ${
                  filterStatus === "upcoming"
                    ? "bg-primary-50 text-primary-700"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterStatus("past")}
                className={`px-3 py-2 text-sm font-medium transition-colors border-l ${
                  filterStatus === "past"
                    ? "bg-primary-50 text-primary-700"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Past Visits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
          <p className="text-sm text-gray-500">Total Patients</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">
            {patients.filter((p) => p.hasUpcoming).length}
          </p>
          <p className="text-sm text-gray-500">With Upcoming</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-accent-600">
            {patients.filter((p) => p.totalVisits > 0).length}
          </p>
          <p className="text-sm text-gray-500">Past Visits</p>
        </div>
      </div>

      {/* Patient list */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Last Visit
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Next Appointment
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Condition
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm text-gray-500">
                        Loading patient data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {patient.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Age: {patient.age} • {patient.totalVisits} visit
                            {patient.totalVisits !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.lastVisitDate ? (
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-700">
                            {formatDate(patient.lastVisitDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          No visits yet
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.nextAppointmentDate ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                              {getRelativeTime(patient.nextAppointmentDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {patient.nextAppointmentTime}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          None scheduled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                        {patient.nextAppointmentCondition ||
                          patient.lastVisitCondition || (
                            <span className="text-gray-400 italic">
                              No record
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          to={`/doctor/patient/${patient.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          View Record
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="More options"
                          title="More options"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No patients found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
