import { Outlet } from "react-router-dom";
import { Heart, Shield, Clock, Users } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col bg-medical-pattern">
      {/* Header */}
      <header className="glass border-b border-white/20 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-soft">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">
              MediCare Clinic
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md animate-fadeIn">
          <Outlet />
        </div>
      </main>

      {/* Trust Indicators */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-primary-100 rounded-full mb-2">
              <Shield className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              Secure & Private
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-accent-100 rounded-full mb-2">
              <Clock className="h-5 w-5 text-accent-600" />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              24/7 Available
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-purple-100 rounded-full mb-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              Expert Doctors
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass border-t border-white/20 py-4 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} MediCare Clinic. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
