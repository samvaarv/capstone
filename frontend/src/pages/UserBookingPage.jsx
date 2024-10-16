import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../components/Input";

const UserBookingPage = () => {
  const { id } = useParams(); // Service ID from URL
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState({}); // State for error messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/services");
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();

    const fetchAvailableDates = async () => {
      try {
        const response = await axios.get("/api/booking-dates");
        const dates = response.data.availableDates;

        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableSlots = async () => {
        try {
          const dateString = new Date(selectedDate).toISOString().split("T")[0];
          const response = await axios.get(`/api/booking/${dateString}`);
          setAvailableSlots(response.data.timeSlots || []);
        } catch (error) {
          console.error("Error fetching available slots:", error);
        }
      };
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Reset errors
    setErrors({});

    let hasError = false;
    const newErrors = {};

    // Validate selected service
    if (!selectedService) {
      newErrors.selectedService = "Please select a service.";
      hasError = true;
    }

    // Validate selected date
    if (!selectedDate) {
      newErrors.selectedDate = "Please select a date.";
      hasError = true;
    }

    // Validate selected slot
    if (!selectedSlot) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedSlot: "Please select a time slot.",
      }));
      return;
    }

    // Validate details
    if (!details.trim()) {
      newErrors.details = "Please provide details about your shoot.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return; // Prevent booking if there are validation errors
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to be logged in to book.");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.post(
        "/api/client/book",
        {
          userId,
          serviceId: id,
          date: selectedDate,
          timeSlot: selectedSlot,
          details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      navigate("/thank-you");
    } catch (error) {
      console.error("Error creating booking", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create booking.");
      }
    }
  };

  return (
    <section className="border-b border-dark">
      <div className="md:grid grid-cols-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="col-start-1 col-span-2 md:border-r md:border-dark relative h-full pt-16">
          <h1 className="text-5xl md:text-8xl font-bold mb-8 md:mb-0 font-light tracking-widest text-nowrap md:rotate-90 md:absolute md:left-1/2 md:transform md:origin-left">
            LET'S CHAT
          </h1>
        </div>
        <div className="col-start-4 col-span-8 px-0 pb-16 md:p-20">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-md md:text-4xl font-light mb-8 uppercase tracking-2 md:leading-10">
              I’M SO HAPPY YOU ARE HERE AND YOU WANT MORE. AND I CAN’T WAIT TO
              MEET YOU.
            </h2>
            <h3 className="text-xs uppercase tracking-2 mt-4 mb-10">
              BELOW YOU’LL FIND THE AREA TO GET IN TOUCH WITH ME. BE SURE TO
              FILL OUT ALL THE FIELDS BELOW. AND BE SURE TO CHECK OUT THE PAGES
              MENTIONED HERE FIRST SO WE KNOW EVERYTHING IS GOING TO BE GOLDEN.
            </h3>
            <form onSubmit={handleBooking}>
              <div className="relative mb-6">
                <label className="block text-dark tracking-2 text-xs mb-2">
                  SELECT A SERVICE
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="w-full pl-3 pr-3 py-2 bg-white bg-opacity-50 border border-dark focus:border-primary text-dark transition duration-200"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.selectedService && (
                  <p className="text-red-500 text-xs">
                    {errors.selectedService}
                  </p>
                )}
              </div>
              <div className="relative mb-6">
                <label className="block text-dark tracking-2 text-xs mb-2">
                  SELECT A DATE AND TIME
                </label>
                <div className="date-selection">
                  {availableDates.length > 0 ? (
                    availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`py-2 px-8 mr-2 ${
                          selectedDate === date
                            ? "bg-primary border border-primary text-white"
                            : "bg-white border boreder-dark hover:bg-primary hover:border-primary hover:text-white transition duration-10"
                        }`}
                      >
                        {new Date(date).toDateString()}
                      </button>
                    ))
                  ) : (
                    <p>No available dates.</p>
                  )}
                </div>
                {errors.selectedDate && (
                  <p className="text-red-500 text-xs">{errors.selectedDate}</p>
                )}
              </div>
              {/* Time Slot Selection */}
              <h4 className="uppercase text-xs mt-4 mb-2">
                Available Time Slots for{" "}
                <strong>{new Date(selectedDate).toDateString()}</strong>
              </h4>
              <div className="time-slots flex flex-wrap gap-4 mb-6">
                {availableSlots.length > 0 ? (
                  availableSlots
                    .sort((a, b) => {
                      const parseTime = (timeStr) => {
                        const [time, period] = timeStr.split(" ");
                        let [hours, minutes] = time.split(":").map(Number);

                        if (period === "PM" && hours !== 12) {
                          hours += 12;
                        }
                        if (period === "AM" && hours === 12) {
                          hours = 0;
                        }

                        return new Date(1970, 0, 1, hours, minutes);
                      };

                      return parseTime(a) - parseTime(b);
                    })
                    .map((slot) => (
                      <label key={slot} className="inline-block relative">
                        <input
                          className="invisible absolute h-full w-full mr-3"
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          required
                          checked={selectedSlot === slot}
                          onChange={() => setSelectedSlot(slot)}
                        />
                        <span
                          className={`block radio-input border px-6 py-2 text-xs ${
                            selectedSlot === slot
                              ? "border-primary bg-primary"
                              : "border-dark bg-transparent hover:text-white hover:bg-primary"
                          }`}
                        >
                          {slot}
                        </span>
                      </label>
                    ))
                ) : (
                  <p>No available time slots for this date.</p>
                )}
                {errors.selectedSlot && (
                  <p className="text-red-500 text-xs">{errors.selectedSlot}</p>
                )}
              </div>
              {/* Details Section */}
              <div className="relative mb-6">
                <Input
                  label="Tell us about your shoot vision and goals. Include anything specific you are hoping to see in your photos. *"
                  type="textarea"
                  placeholder="Feel free to tell us about your vision for your perfect day"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
                {errors.details && (
                  <p className="text-red-500 text-xs">{errors.details}</p>
                )}
              </div>
              <button
                className="py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
                type="submit"
              >
                BOOK NOW
              </button>
            </form>
          </motion.section>
        </div>
      </div>
    </section>
  );
};

export default UserBookingPage;
