// src/pages/BookingManagement.jsx
import { useState } from "react";
import axios from "axios";

const BookingManagement = () => {
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("/api/admin/booking", {
        date,
        timeSlots: timeSlots.split(",").map((slot) => slot.trim()), // Expecting comma-separated time slots
      });
      alert("Availability added successfully");
    } catch (error) {
      console.error("Error adding availability:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Time slots (comma separated)"
          value={timeSlots}
          onChange={(e) => setTimeSlots(e.target.value)}
          required
          className="mt-4"
        />
        <button type="submit" className="mt-4">
          Add Availability
        </button>
      </form>
    </div>
  );
};

export default BookingManagement;
