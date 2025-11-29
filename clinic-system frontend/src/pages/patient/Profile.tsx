import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Save,
  Heart,
  AlertTriangle,
  FileText,
  Loader2,
  Edit2,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";

const PatientProfile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medicalHistory: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user profile from API
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        if (response.data.success) {
          const userData = response.data.user;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            age: userData.age?.toString() || "",
            phone: userData.phone || "",
            address: userData.address || "",
            emergencyContact: userData.emergencyContact?.name || "",
            emergencyPhone: userData.emergencyContact?.phone || "",
            allergies: userData.allergies || "",
            medicalHistory: userData.medicalHistory || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback to user context data
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            age: user.age?.toString() || "",
            phone: "",
            address: "",
            emergencyContact: "",
            emergencyPhone: "",
            allergies: "",
            medicalHistory: "",
          });
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await userAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        phone: formData.phone,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContact,
          phone: formData.emergencyPhone,
        },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Input field component for consistent styling
  const InputField = ({
    id,
    name,
    label,
    type = "text",
    icon: Icon,
    disabled = false,
    value,
    placeholder,
  }: {
    id: string;
    name: string;
    label: string;
    type?: string;
    icon?: any;
    disabled?: boolean;
    value: string;
    placeholder?: string;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
      >
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled || !isEditing}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? "pl-12" : "px-4"
          } pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none ${
            disabled || !isEditing
              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
              : ""
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">Account</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">
          View and manage your personal information
        </p>
      </div>

      <div className="card overflow-hidden animate-slideUp">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-white">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-primary-100 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {formData.email}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isEditing
                    ? "bg-red-500/20 text-white hover:bg-red-500/30"
                    : "bg-white text-primary-700 hover:bg-primary-50 shadow-soft"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 rounded-lg">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  Personal Information
                </h3>
              </div>

              <InputField
                id="name"
                name="name"
                label="Full Name"
                icon={User}
                value={formData.name}
                placeholder="Enter your full name"
              />

              <InputField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                icon={Mail}
                value={formData.email}
                placeholder="Enter your email"
              />

              <InputField
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                icon={Phone}
                value={formData.phone}
                placeholder="Enter your phone number"
              />

              <InputField
                id="age"
                name="age"
                label="Age"
                type="number"
                icon={Calendar}
                value={formData.age}
                placeholder="Enter your age"
              />

              <div className="md:col-span-2">
                <InputField
                  id="address"
                  name="address"
                  label="Address"
                  icon={Home}
                  value={formData.address}
                  placeholder="Enter your full address"
                />
              </div>

              {/* Emergency Contact Section */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  Emergency Contact
                </h3>
              </div>

              <InputField
                id="emergencyContact"
                name="emergencyContact"
                label="Contact Person"
                icon={User}
                value={formData.emergencyContact}
                placeholder="Emergency contact name"
              />

              <InputField
                id="emergencyPhone"
                name="emergencyPhone"
                label="Contact Phone"
                type="tel"
                icon={Phone}
                value={formData.emergencyPhone}
                placeholder="Emergency contact phone"
              />

              {/* Medical Information Section */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <div className="p-1.5 bg-accent-100 rounded-lg">
                    <Heart className="h-4 w-4 text-accent-600" />
                  </div>
                  Medical Information
                </h3>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3 mb-4">
                  <FileText className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    This information can only be updated by your doctor during
                    appointments.
                  </p>
                </div>
              </div>

              <InputField
                id="allergies"
                name="allergies"
                label="Allergies"
                icon={AlertTriangle}
                value={formData.allergies || "None reported"}
                disabled={true}
              />

              <InputField
                id="medicalHistory"
                name="medicalHistory"
                label="Medical History"
                icon={FileText}
                value={formData.medicalHistory || "No history on file"}
                disabled={true}
              />
            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
