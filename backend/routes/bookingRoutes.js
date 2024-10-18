import express from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  getBookingByDate,
  createUserBooking,
  getAvailableBookingDates,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import UserBooking from "../models/userBookingModel.js";
import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";

import { sendCancellationEmail } from "../sendGrid/emails.js"; // Add your email logic

const router = express.Router();

// Admin Routes
router.post("/admin/booking", verifyToken, requireAdmin, createBooking); // Admin creates booking
router.get("/admin/booking", verifyToken, requireAdmin, getBookings); // Admin fetches all bookings
router.put("/admin/booking/:id", verifyToken, requireAdmin, updateBooking); // Admin updates a booking
router.delete("/admin/booking/:id", verifyToken, requireAdmin, deleteBooking); // Admin deletes a booking
router.get("/admin/booking/:date", verifyToken, requireAdmin, getBookingByDate); // Admin fetches booking by date

// Client/User Routes
router.get("/booking/:date", getBookingByDate); // Clients fetch available slots for a date
router.post("/client/book", verifyToken, createUserBooking); // Clients book a time slot
// Fetch all available booking dates
router.get("/booking-dates", getAvailableBookingDates);

router.get("/client/bookings", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await UserBooking.find({ user: userId }).populate(
      "service"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
router.get("/admin/bookings", verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await UserBooking.find()
      .sort({ date: 1 })
      .populate("user")
      .populate("service"); // Sort by date, earliest first
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
// Route to cancel booking and send email
router.delete("/client/bookings/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await UserBooking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the user associated with the booking
    const user = await User.findById(booking.user);
    if (user) {
      // Send cancellation email to the user
      const message = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: "Booking Cancellation",
        text: `Your booking for ${booking.date} at ${booking.timeSlot} has been cancelled.`,
      };

      // Send the email
      await sendCancellationEmail(message);
      console.log(`Cancellation email sent to ${user.email}`);
    }

    // Also send email to admin
    const adminMessage = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      replyTo: user.email,
      subject: "Booking Cancellation - Admin Notification",
      text: `User booking for ${booking.date} at ${booking.timeSlot} has been cancelled.`,
    };

    // Send the admin email
    await sendCancellationEmail(adminMessage);
    console.log(`Cancellation email sent to admin: ${process.env.ADMIN_EMAIL}`);

    res
      .status(200)
      .json({ message: "Booking cancelled successfully and emails sent." });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

router.put("/bookings/restore", verifyToken, async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    // Find the admin booking for the specified date
    const booking = await Booking.findOne({ date });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Add the time slot back to the available time slots
    if (!booking.timeSlots.includes(timeSlot)) {
      booking.timeSlots.push(timeSlot);
      await booking.save();
    }

    res.status(200).json({ message: "Time slot restored successfully." });
  } catch (error) {
    console.error("Error restoring time slot:", error);
    res.status(500).json({ message: "Error restoring time slot." });
  }
});

export default router;
