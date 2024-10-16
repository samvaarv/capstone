import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const UserBookingManagement = () => {
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data); // Assuming response.data is the bookings array
      } catch (error) {
        console.error("Error fetching bookings:", error.response?.data); // Log the error response
        toast.error("Failed to fetch bookings."); // Notify the user of the error
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
      {bookings.length > 0 ? ( // Check if there are bookings
        <div className="grid md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
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
                <span className="text-lg">{new Date(booking.date).toLocaleDateString()}</span>
              </p>
              <p className="uppercase text-xs font-extralight mb-2">
                <span className="font-medium">Booked time:</span>{" "}
               <span className="text-lg"> {booking.timeSlot}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings available.</p> // Handle case where there are no bookings
      )}
    </motion.section>
  );
};

export default UserBookingManagement;
