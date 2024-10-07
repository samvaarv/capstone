import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Install react-calendar if you haven't
import axios from "axios";
import { toast } from "react-toastify";
import 'react-calendar/dist/Calendar.css'; // Import the Calendar CSS

const timeOptions = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
];

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  // Fetch existing bookings to show below
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/admin/booking");
        setExistingBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };
    fetchBookings();
  }, []);

  // Fetch existing time slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(`/api/admin/booking/${selectedDate}`);
        if (response.data && response.data.timeSlots) {
          setTimeSlots(response.data.timeSlots);
          setAllSelected(response.data.timeSlots.length === timeOptions.length); // Set selectAll based on fetched slots
        } else {
          setTimeSlots([]); // No slots for this date
          setAllSelected(false); // Reset selectAll when switching dates
        }
      } catch (error) {
        console.error("Error fetching time slots", error);
        setTimeSlots([]);
        setAllSelected(false); // Reset selectAll on error
      }
    };

    // Reset allSelected and timeSlots when a new date is selected
    fetchTimeSlots();
  }, [selectedDate]);

  // Handle selecting/deselecting individual time slots
  const handleTimeSlotChange = (time) => {
    if (timeSlots.includes(time)) {
      setTimeSlots(timeSlots.filter((t) => t !== time));
    } else {
      setTimeSlots([...timeSlots, time]);
    }
  };

  // Select/Deselect all time slots
  const handleSelectAll = () => {
    if (allSelected) {
      setTimeSlots([]); // Deselect all
    } else {
      setTimeSlots(timeOptions); // Select all
    }
    setAllSelected(!allSelected);
  };

  // Handle form submission to save or update booking
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/admin/booking", {
        date: selectedDate,
        timeSlots,
      });
      toast.success("Booking saved successfully!");
      
      // Fetch updated bookings
      const updatedBookings = await axios.get("/api/admin/booking");
      setExistingBookings(updatedBookings.data.bookings);

    } catch (error) {
      console.error("Error saving booking", error);
      toast.error("Failed to save booking.");
    }
  };

  return (
    <div className="booking-management max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Booking Management</h2>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileDisabled={({ date }) => date < new Date()} // Disable past dates
      />

      <h3 className="mt-6">Select Time Slots for {selectedDate.toDateString()}</h3>

      <div>
        <label className="block mb-4">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <span className="ml-2">Select All</span>
        </label>

        <div className="grid grid-cols-3 gap-4">
          {timeOptions.map((time) => (
            <label key={time} className="block">
              <input
                type="checkbox"
                value={time}
                checked={timeSlots.includes(time)}
                onChange={() => handleTimeSlotChange(time)}
              />
              <span className={`ml-2 ${timeSlots.includes(time) ? "font-bold text-green-600" : ""}`}>
                {time}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        className="bg-blue-500 text-white mt-4 py-2 px-4 rounded"
      >
        Set Date and Slots
      </button>

      {/* Show created bookings */}
      <div className="mt-8">
        <h3 className="text-xl font-bold">Existing Bookings</h3>

        {existingBookings.length > 0 ? (
          <ul className="mt-4">
            {existingBookings.map((booking) => (
              <li key={booking._id} className="border p-4 mb-2 rounded">
                <strong>Date:</strong> {new Date(booking.date).toDateString()} <br />
                <strong>Time Slots:</strong> {booking.timeSlots.join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
