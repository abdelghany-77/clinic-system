import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  X,
  User,
  Calendar,
  ClipboardList,
  Users,
  Home,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDoctor = user?.role === "doctor";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const patientLinks = [
    {
      to: "/patient/dashboard",
      icon: <Home className="h-5 w-5" />,
      text: "Dashboard",
    },
    {
      to: "/patient/book-appointment",
      icon: <Calendar className="h-5 w-5" />,
      text: "Book Appointment",
    },
    {
      to: "/patient/medical-records",
      icon: <ClipboardList className="h-5 w-5" />,
      text: "Medical Records",
    },
    {
      to: "/patient/profile",
      icon: <User className="h-5 w-5" />,
      text: "My Profile",
    },
  ];

  const doctorLinks = [
    {
      to: "/doctor/dashboard",
      icon: <Home className="h-5 w-5" />,
      text: "Dashboard",
    },
    {
      to: "/doctor/patients",
      icon: <Users className="h-5 w-5" />,
      text: "Patients",
    },
    {
      to: "/doctor/appointments",
      icon: <Calendar className="h-5 w-5" />,
      text: "Appointments",
    },
    {
      to: "/doctor/profile",
      icon: <Settings className="h-5 w-5" />,
      text: "Settings",
    },
  ];

  const links = isDoctor ? doctorLinks : patientLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-gray-200 py-3 px-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            title="Toggle menu"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <Link
            to={`/${user?.role}/dashboard`}
            className="flex items-center gap-2"
          >
            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient hidden sm:block">
              MediCare
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right">
              <p className="font-medium text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {isDoctor ? "Doctor" : "Patient"}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-grow flex">
        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 z-30 bg-gray-900/50 transition-opacity md:hidden ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:z-0`}
        >
          {/* Mobile Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 md:hidden">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">MediCare</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close menu"
              title="Close menu"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* User Info - Mobile */}
          <div className="p-4 border-b border-gray-200 md:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {isDoctor ? "Doctor" : "Patient"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Menu
            </p>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`nav-link ${
                  location.pathname === link.to
                    ? "nav-link-active"
                    : "nav-link-inactive"
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.text}</span>
              </Link>
            ))}

            <hr className="my-4 border-gray-200" />

            <button
              onClick={handleLogout}
              className="nav-link nav-link-inactive w-full text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 overflow-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
