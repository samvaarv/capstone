import express from "express";
import { createBooking, getBookings, updateBooking, deleteBooking, getBookingByDate, createUserBooking } from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

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

export default router;
