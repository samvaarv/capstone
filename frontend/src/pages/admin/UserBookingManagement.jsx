import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const UserBookingManagement = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date(); // Get current date and time
        const todayDate = now.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Function to convert "1:30 PM" into a Date object for time comparison
        const parseTimeSlot = (timeSlot) => {
          const [time, modifier] = timeSlot.split(" ");
          let [hours, minutes] = time.split(":");

          if (modifier === "PM" && hours !== "12") {
            hours = parseInt(hours, 10) + 12;
          } else if (modifier === "AM" && hours === "12") {
            hours = "00";
          }
          return new Date(`1970-01-01T${hours}:${minutes}:00`);
        };

        const upcoming = [];
        const past = [];

        response.data.forEach((booking) => {
          const bookingDate = new Date(booking.date).toISOString().split("T")[0];
          const bookingTime = parseTimeSlot(booking.timeSlot); // Convert timeSlot to a Date object
          const currentTime = new Date(`1970-01-01T${now.getHours()}:${now.getMinutes()}:00`);

          if (bookingDate < todayDate) {
            // Booking is in the past (before today)
            past.push(booking);
          } else if (bookingDate > todayDate) {
            // Booking is in the future (after today)
            upcoming.push(booking);
          } else {
            // Booking is for today, compare times
            if (bookingTime <= currentTime) {
              // If booking time is earlier than or equal to current time, move to past bookings
              past.push(booking);
            } else {
              // If booking time is later than current time, keep it in upcoming
              upcoming.push(booking);
            }
          }
        });

        setUpcomingBookings(upcoming);
        setPastBookings(past);
      } catch (error) {
        console.error("Error fetching bookings:", error.response?.data);
        toast.error("Failed to fetch bookings.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        All Bookings
      </h3>

      {/* Upcoming Bookings Section */}
      <h4 className="text-lg font-bold mb-3">Upcoming Bookings</h4>
      {upcomingBookings.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingBookings.map((booking) => (
            <div
              key={booking._id}
              className="mt-2 w-full border border-dark p-4"
            >
              <h5 className="font-semibold text-lg uppercase mb-3">
                {booking.user.name}
              </h5>
              <p className="font-normal uppercase mb-3">
                {booking.service.name}
              </p>
              <p className="uppercase text-xs font-extralight mb-2">
                <span className="font-medium">Booked Date: </span>
                <span className="text-lg">
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </p>
              <p className="uppercase text-xs font-extralight mb-2">
                <span className="font-medium">Booked Time:</span>{" "}
                <span className="text-lg">{booking.timeSlot}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming bookings available.</p>
      )}

      {/* Past Bookings Section */}
      <h4 className="text-lg font-bold mb-3 mt-8">Past Bookings</h4>
      {pastBookings.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {pastBookings.map((booking) => (
            <div
              key={booking._id}
              className="mt-2 w-full border border-dark p-4"
            >
              <h5 className="font-semibold text-lg uppercase mb-3">
                {booking.user.name}
              </h5>
              <p className="font-normal uppercase mb-3">
                {booking.service.name}
              </p>
              <p className="uppercase text-xs font-extralight mb-2">
                <span className="font-medium">Booked Date: </span>
                <span className="text-lg">
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </p>
              <p className="uppercase text-xs font-extralight mb-2">
                <span className="font-medium">Booked Time:</span>{" "}
                <span className="text-lg">{booking.timeSlot}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No past bookings available.</p>
      )}
    </motion.section>
  );
};

export default UserBookingManagement;
