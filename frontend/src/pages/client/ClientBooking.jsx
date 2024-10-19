import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ClientBooking = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // For selected booking
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // Modal state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/client/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const today = new Date().toISOString().split("T")[0];

        const upcoming = response.data.filter(
          (booking) =>
            new Date(booking.date).toISOString().split("T")[0] >= today
        );
        const past = response.data.filter(
          (booking) =>
            new Date(booking.date).toISOString().split("T")[0] < today
        );

        setUpcomingBookings(upcoming);
        setPastBookings(past);
      } catch (error) {
        console.error("Error fetching bookings:", error.response?.data);
        toast.error("Failed to fetch bookings.");
      }
    };

    fetchBookings();
  }, []);

  // Handle the cancellation logic
  const handleCancel = (booking) => {
    setSelectedBooking(booking); // Set the booking to be cancelled
    setDeleteConfirmationOpen(true); // Open the confirmation modal
  };

  const confirmCancellation = async () => {
    if (selectedBooking) {
      try {
        await axios.delete(`/api/client/bookings/${selectedBooking._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        await axios.put(
          `/api/bookings/restore`,
          {
            date: selectedBooking.date,
            timeSlot: selectedBooking.timeSlot,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success("Booking cancelled and email sent.");
        navigate("/client/dashboard"); // Redirect to dashboard

        // Refresh bookings after cancellation
        setDeleteConfirmationOpen(false);
        setSelectedBooking(null); // Clear the selected booking
      } catch (error) {
        console.error("Error during cancellation:", error);
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        My Bookings
      </h3>
      <div className="mb-10">
        <h4 className="uppercase text-md font-semibold mb-3">
          Upcoming Bookings
        </h4>
        {upcomingBookings.length > 0 ? (
          <ul className="grid md:grid-cols-2 gap-4">
            {upcomingBookings.map((booking) => (
              <li
                key={booking._id}
                className="mt-2 w-full border border-dark p-4"
              >
                <h6 className="font-medium uppercase mb-3">
                  {booking.service.name}
                </h6>
                <p className="uppercase text-xs font-extralight mb-2">
                  <span className="font-medium">Booked Date: </span>
                  {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="uppercase text-xs font-extralight mb-2">
                  <span className="font-medium">Booked time:</span>{" "}
                  {booking.timeSlot}
                </p>
                <button
                  onClick={() => handleCancel(booking)}
                  className="bg-red-500 text-white text-xs uppercase py-2 px-5 hover:bg-red-700 transition mt-3"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs">No upcoming bookings.</p>
        )}
      </div>

      <div className="mt-4">
        <h4 className="uppercase text-md font-semibold mb-3">Past Bookings</h4>
        {pastBookings.length > 0 ? (
          <ul className="grid md:grid-cols-2 gap-4">
            {pastBookings.map((booking) => (
              <li
                key={booking._id}
                className="mt-2 w-full border border-dark p-4"
              >
                <h6 className="font-medium uppercase mb-3">
                  {booking.service.name}
                </h6>
                <p className="uppercase text-xs font-extralight mb-2">
                  <span className="font-medium">Booked Date: </span>
                  {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="uppercase text-xs font-extralight mb-2">
                  <span className="font-medium">Booked time:</span>{" "}
                  {booking.timeSlot}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs">No past bookings.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {deleteConfirmationOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to cancel this booking?
            </h3>
            <div>
              <p className="uppercase font-semibold mb-2">
                {selectedBooking.service.name}
              </p>
              <p className="uppercase mb-2">
                <strong>Date: </strong>{" "}
                {new Date(selectedBooking.date).toLocaleDateString()}
              </p>
              <p className="uppercase mb-4">
                <strong>Time: </strong> {selectedBooking.timeSlot}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteConfirmationOpen(false)} // Close confirmation modal
                className="text-dark text-xs uppercase py-2 px-5 border border-dark hover:text-white hover:bg-dark transition mt-3 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancellation} // Confirm cancellation
                className="bg-red5400 text-white text-xs uppercase py-2 px-5 bg-red-500 hover:bg-red-700 transition mt-3"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ClientBooking;
