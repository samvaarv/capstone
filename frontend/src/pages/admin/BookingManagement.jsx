import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-calendar/dist/Calendar.css"; // Import the Calendar CSS

const timeOptions = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
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

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow's date
    setSelectedDate(tomorrow);
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        Add new Availability
      </h3>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileDisabled={({ date }) => date < new Date()} // Disable past dates
      />

      <h3 className="uppercase my-6">
        Select Time Slots for <strong>{selectedDate.toDateString()}</strong>
      </h3>

      <div>
        <label className="block mb-4">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <span className="uppercase font-semibold ml-2">Select All</span>
        </label>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {timeOptions.map((time) => (
            <label key={time} className="block">
              <input
                type="checkbox"
                value={time}
                checked={timeSlots.includes(time)}
                onChange={() => handleTimeSlotChange(time)}
              />
              <span
                className={`ml-2 ${
                  timeSlots.includes(time) ? "font-bold text-green-600" : ""
                }`}
              >
                {time}
              </span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="uppercase py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
      >
        Set Date and Slots
      </button>

      {/* Show created bookings */}
      <div className="mt-10">
        <h4 className="uppercase text-md font-semibold mb-3">
          Existing Bookings
        </h4>
        {existingBookings.length > 0 ? (
          <ul className="mt-4">
            {existingBookings.map((booking) => (
              <li key={booking._id} className="border border-dark p-4 mb-2">
                <p className="uppercase mb-2">
                  <strong>Date:</strong> {new Date(booking.date).toDateString()}
                </p>
                <p className="uppercase">
                  <strong>Time Slots:</strong> {booking.timeSlots.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </motion.section>
  );
};

export default BookingManagement;
