import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Stethoscope,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Activity,
  Heart,
  Loader2,
  User,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { clinicTypeAPI, appointmentAPI } from "../../services/api";

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [selectedClinic, setSelectedClinic] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinicTypes, setClinicTypes] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate time slots from 10 AM to 11 PM (30 minute intervals)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 10; hour <= 23; hour++) {
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      slots.push(`${hour12}:00 ${ampm}`);
      if (hour < 23) {
        slots.push(`${hour12}:30 ${ampm}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) {
        setBookedSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const response = await appointmentAPI.getBookedSlots(dateStr);
        if (response.data.success) {
          setBookedSlots(response.data.bookedSlots);
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
    // Clear selected time when date changes
    setSelectedTime("");
  }, [selectedDate]);

  // Fetch clinic types from API
  useEffect(() => {
    const fetchClinicTypes = async () => {
      try {
        const response = await clinicTypeAPI.getAll();
        if (response.data.success) {
          setClinicTypes(response.data.clinicTypes);
        }
      } catch (error) {
        console.error("Error fetching clinic types:", error);
        // Fallback to default clinic types
        setClinicTypes([
          {
            _id: "1",
            name: "General Medicine",
            description: "For common illnesses and check-ups",
          },
          {
            _id: "2",
            name: "Dental Clinic",
            description: "For tooth and gum treatments",
          },
          {
            _id: "3",
            name: "Neurology",
            description: "For brain and nervous system issues",
          },
          {
            _id: "4",
            name: "Cardiology",
            description: "For heart and cardiovascular conditions",
          },
          {
            _id: "5",
            name: "Orthopedics",
            description: "For bone and joint problems",
          },
          {
            _id: "6",
            name: "Pathology",
            description: "For diagnostic testing and lab work",
          },
        ]);
      }
    };
    fetchClinicTypes();
  }, []);

  // Generate days for the calendar
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

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
      const date = new Date(year, month, i);

      // Only include future dates and exclude weekends
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      if (!isPast && !isWeekend) {
        days.push(date);
      } else {
        days.push({ date, disabled: true });
      }
    }

    return days;
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Go to previous month
  const prevMonth = () => {
    // Don't allow going to past months
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const today = new Date();
    if (
      previousMonth.getMonth() >= today.getMonth() ||
      previousMonth.getFullYear() > today.getFullYear()
    ) {
      setCurrentMonth(previousMonth);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedClinic) {
      toast.error("Please select a clinic type");
      return;
    }

    if (currentStep === 2 && !healthCondition) {
      toast.error("Please describe your health condition");
      return;
    }

    if (currentStep === 3 && (!selectedDate || !selectedTime)) {
      toast.error("Please select both date and time");
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  // Handle back step
  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await appointmentAPI.create({
        clinicType: selectedClinic,
        healthCondition,
        date: selectedDate?.toISOString() || "",
        time: selectedTime,
      });

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        navigate("/patient/dashboard");
      } else {
        toast.error(response.data.message || "Failed to book appointment");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 animate-fadeIn">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-soft">
            <CalendarCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Book an Appointment
          </h1>
          <p className="text-gray-500 mt-1">
            Schedule a visit with our specialists
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Background track */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>

            {/* Progress fill */}
            <div
              className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-primary-500 to-primary-600 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>

            {/* Step indicators */}
            {[
              { step: 1, label: "Clinic", icon: Stethoscope },
              { step: 2, label: "Symptoms", icon: Activity },
              { step: 3, label: "Schedule", icon: Calendar },
              { step: 4, label: "Confirm", icon: CalendarCheck },
            ].map(({ step, label, icon: Icon }) => (
              <div
                key={step}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-colors ${
                    currentStep >= step ? "text-primary-600" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Clinic Type */}
          {currentStep === 1 && (
            <div className="animate-slideUp">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-primary-100 rounded-lg">
                  <Stethoscope className="h-4 w-4 text-primary-600" />
                </div>
                Select Clinic Type
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {clinicTypes.map((clinic) => (
                  <div
                    key={clinic._id || clinic.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      selectedClinic === clinic.name
                        ? "border-primary-500 bg-primary-50 shadow-soft"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedClinic(clinic.name)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          selectedClinic === clinic.name
                            ? "bg-gradient-to-br from-primary-500 to-primary-700"
                            : "bg-gray-100"
                        }`}
                      >
                        <Stethoscope
                          className={`h-5 w-5 ${
                            selectedClinic === clinic.name
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {clinic.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {clinic.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Health Condition */}
          {currentStep === 2 && (
            <div className="animate-slideUp">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-red-100 rounded-lg">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                Describe Your Health Condition
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="healthCondition"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                >
                  <Activity className="h-4 w-4 text-gray-400" />
                  Please describe your symptoms or reason for visit
                </label>
                <textarea
                  id="healthCondition"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none resize-none"
                  placeholder="E.g., I've been experiencing headaches for the past week, along with occasional dizziness..."
                  value={healthCondition}
                  onChange={(e) => setHealthCondition(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-800">
                  <strong>Note:</strong> Providing clear details about your
                  symptoms helps the doctor prepare for your visit and provide
                  better care.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Select Date and Time */}
          {currentStep === 3 && (
            <div className="animate-slideUp">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                Select Date and Time
              </h2>

              {/* Calendar */}
              <div className="mb-8 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Select Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      aria-label="Previous month"
                      title="Previous month"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-500" />
                    </button>
                    <span className="font-semibold text-gray-800 min-w-[140px] text-center">
                      {formatMonth(currentMonth)}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      aria-label="Next month"
                      title="Next month"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-500 py-2 uppercase tracking-wide"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {generateCalendarDays().map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="p-2"></div>;
                    }

                    if (typeof day === "object" && "disabled" in day) {
                      return (
                        <div
                          key={`disabled-${index}`}
                          className="p-2 text-center text-gray-300"
                        >
                          {day.date.getDate()}
                        </div>
                      );
                    }

                    const date = day as Date;
                    return (
                      <div
                        key={`day-${index}`}
                        onClick={() => handleDateSelect(date)}
                        className={`p-2 text-center cursor-pointer rounded-xl transition-all duration-200 font-medium ${
                          isDateSelected(date)
                            ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft"
                            : "text-gray-700 hover:bg-white"
                        }`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  Select Time Slot
                  {loadingSlots && (
                    <Loader2 className="h-4 w-4 text-primary-500 animate-spin ml-2" />
                  )}
                </h3>

                {selectedDate ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => !isBooked && handleTimeSelect(time)}
                          disabled={isBooked}
                          className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isBooked
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                              : selectedTime === time
                              ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white border-primary-500 shadow-soft"
                              : "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                          title={
                            isBooked ? "This time slot is already booked" : ""
                          }
                        >
                          {time}
                          {isBooked && (
                            <span className="block text-xs text-gray-400 mt-0.5">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Please select a date first to view available time slots
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review and Confirm */}
          {currentStep === 4 && (
            <div className="animate-slideUp">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-accent-100 rounded-lg">
                  <CalendarCheck className="h-4 w-4 text-accent-600" />
                </div>
                Review and Confirm
              </h2>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Patient
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {user?.name}, {user?.age} years
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <Stethoscope className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Clinic Type
                        </h3>
                        <p className="text-gray-900 font-medium">
                          {selectedClinic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Date & Time
                        </h3>
                        <p className="text-gray-900 font-medium">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-primary-600 font-semibold">
                          {selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 border-t border-gray-200">
                    <div className="p-2 bg-white rounded-lg">
                      <Heart className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Health Condition
                      </h3>
                      <p className="text-gray-800">{healthCondition}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Please arrive 15 minutes before
                  your appointment time. If you need to cancel, please do so at
                  least 24 hours in advance.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBackStep}
                className="btn-secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto btn-primary"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Confirm Appointment
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
