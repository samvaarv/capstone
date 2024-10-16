import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar"; // Make sure to install this package
import { toast } from "react-toastify";
import 'react-calendar/dist/Calendar.css'; // Import the Calendar CSS

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [userInfo, setUserInfo] = useState({}); // For user details (if needed)

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`/api/services/${serviceId}`);
        setService(response.data.service);
      } catch (error) {
        console.error("Error fetching service details", error);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(`/api/admin/booking/${selectedDate}`);
        setTimeSlots(response.data.timeSlots || []);
      } catch (error) {
        console.error("Error fetching time slots", error);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      const response = await axios.post("/api/bookings", {
        serviceId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        user: userInfo // Include user info if needed
      });
      toast.success("Booking successful!");
      navigate("/thank-you"); // Redirect to a thank you page or dashboard
    } catch (error) {
      console.error("Error during booking", error);
      toast.error("Failed to book the service.");
    }
  };

  return (
    <div className="booking-page max-w-4xl mx-auto mt-10">
      {service && (
        <>
          <h2 className="text-2xl font-bold mb-6">{service.name}</h2>
          <p>{service.description}</p>
          <p>Price: ${service.price}</p>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileDisabled={({ date }) => date < new Date()} // Disable past dates
          />

          <h3 className="mt-6">Available Time Slots for {selectedDate.toDateString()}</h3>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((time) => (
              <label key={time} className="block">
                <input
                  type="radio"
                  value={time}
                  checked={selectedTimeSlot === time}
                  onChange={() => setSelectedTimeSlot(time)}
                />
                <span className="ml-2">{time}</span>
              </label>
            ))}
          </div>

          <button onClick={handleBooking} className="bg-blue-500 text-white mt-4 py-2 px-4 rounded">
            Book Now
          </button>
        </>
      )}
    </div>
  );
};

export default BookingPage;
