import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';

const UserBookingPage = () => {
  const { id } = useParams(); // Service ID from URL
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [value, setValue] = useState(new Date()); // For calendar
  const [availableSlots, setAvailableSlots] = useState([]); // Available time slots
  const [selectedSlot, setSelectedSlot] = useState(""); // User selected time slot
  const [details, setDetails] = useState(""); // Booking details
  const navigate = useNavigate(); // Use navigate for redirection

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8888',
  });
  

  useEffect(() => {
    const fetchServices = async () => {
        try {
          const response = await axios.get('/api/services');
          setServices(response.data.services);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };
      fetchServices();

    //   const fetchAvailableSlots = async () => {
    //     const dateString = value.toISOString().split('T')[0];  // Ensure correct format
    //     console.log("Fetching available slots for date:", dateString); // Debugging log
        
    //     try {
    //       const response = await axios.get(`/api/booking/${dateString}`);
    //       setAvailableSlots(response.data.timeSlots || []);
    //     } catch (error) {
    //       console.error("Error fetching available slots", error); // Debugging log
    //     }
    //   };
      
      const fetchAvailableSlots = async () => {
        const dateString = value.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        console.log("Fetching available slots for date:", dateString);
      
        try {
          const response = await axios.get(`http://localhost:8888/api/booking/${dateString}`);
          setAvailableSlots(response.data.timeSlots || []);
        } catch (error) {
          console.error("Error fetching available slots", error);
        }
      };
      

    // Fetch available slots only if the date changes
    fetchAvailableSlots();
  }, [value]); // Effect runs when the selected date changes

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot.");
      return;
    }
    
    try {
      const response = await axios.post("/api/client/book", {
        userId: "USER_ID", // Replace with actual user ID
        serviceId: id,
        date: value.toISOString().split('T')[0],
        timeSlot: selectedSlot,
        details,
      });

      toast.success(response.data.message);
      navigate("/thank-you"); // Redirect to a thank you page or your desired page
    } catch (error) {
      console.error("Error creating booking", error);
      toast.error("Failed to create booking.");
    }
  };

  return (
    <div className="user-booking-page">
      <h1 className="text-2xl font-bold">Book a Service</h1>
      <label>
        Select Service:
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <h2>Select a Date</h2>
      <Calendar
        onChange={setValue}
        value={value}
        tileDisabled={({ date }) => date < new Date()} // Disable past dates
      />
      <h3 className="mt-4">Available Time Slots for {value.toDateString()}</h3>

      <div className="time-slots">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot) => (
            <label key={slot} className="block">
              <input
                type="radio"
                name="timeSlot"
                value={slot}
                checked={selectedSlot === slot}
                onChange={() => setSelectedSlot(slot)}
              />
              <span className={`ml-2 ${selectedSlot === slot ? "font-bold text-green-600" : ""}`}>
                {slot}
              </span>
            </label>
          ))
        ) : (
          <p>No available time slots for this date.</p>
        )}
      </div>

      <textarea
        placeholder="Additional details..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="mt-4 w-full p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleBooking}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Book Now
      </button>
    </div>
  );
};

export default UserBookingPage;
