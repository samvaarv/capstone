import Booking from "../models/bookingModel.js";
import UserBooking from "../models/userBookingModel.js";
import sendgrid from "@sendgrid/mail";
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import Notification from "../models/notificationModel.js";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Create or update booking
export const createBooking = async (req, res) => {
  const { date, timeSlots } = req.body;

  try {
    // Check if the booking for this date already exists
    const existingBooking = await Booking.findOne({ date });

    if (timeSlots.length === 0) {
      // If timeSlots are empty, delete the booking
      if (existingBooking) {
        await Booking.findByIdAndDelete(existingBooking._id);
        return res.status(200).json({
          success: true,
          message: "Booking deleted since no time slots selected",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "No booking to delete" });
      }
    }

    if (existingBooking) {
      // Update the existing booking if time slots are provided
      existingBooking.timeSlots = timeSlots;
      await existingBooking.save();
      return res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        booking: existingBooking,
      });
    } else {
      // Create a new booking
      const newBooking = new Booking({ date, timeSlots });
      await newBooking.save();
      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: newBooking,
      });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating booking" });
  }
};

export const createUserBooking = async (req, res) => {
  const { userId, serviceId, date, timeSlot, details } = req.body;
  console.log("Received booking request:", {
    userId,
    serviceId,
    date,
    timeSlot,
    details,
  });

  try {
    const adminBooking = await Booking.findOne({ date });
    console.log("Admin booking found:", adminBooking);

    if (!adminBooking || !adminBooking.timeSlots.includes(timeSlot)) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    const newUserBooking = new UserBooking({
      user: userId,
      service: serviceId,
      date,
      timeSlot,
      details,
    });
    await newUserBooking.save();

    // Remove booked time slot from the admin's booking
    adminBooking.timeSlots = adminBooking.timeSlots.filter(
      (slot) => slot !== timeSlot
    );
    await adminBooking.save();

    // Fetch user and admin emails
    const user = await User.findById(userId);
    const service = await Service.findById(serviceId);
    const adminEmail = process.env.ADMIN_EMAIL;

    // Send email to user
    const userEmailMessage = {
      to: user.email,
      from: process.env.ADMIN_EMAIL,
      subject: "Booking Confirmation",
      text: `Dear ${user.name}, your booking for ${date} at ${timeSlot} has been confirmed.`,
    };

    // Send email to admin
    const adminEmailMessage = {
      to: adminEmail,
      from: process.env.FROM_EMAIL,
      replyTo: user.email,
      subject: "New Booking Alert",
      text: `New booking for ${date} at ${timeSlot} by ${user.name}.`,
    };

    // Log before sending emails
    console.log("Sending email to user:", userEmailMessage);
    console.log("Sending email to admin:", adminEmailMessage);

    await sendgrid.send(userEmailMessage);
    await sendgrid.send(adminEmailMessage);

    // Create notification for the user
    const userNotification = new Notification({
      user: user.email,
      message: `Your booking has been confirmed for ${service.name} on ${date} at ${timeSlot}`,
      type: "booking",
    });
    await userNotification.save();

    // Create notification for the admin
    const adminNotification = new Notification({
      user: adminEmail,
      message: `New booking for ${service.name} on ${date} at ${timeSlot} by ${user.name}.`,
      type: "booking",
    });
    await adminNotification.save();

    res.status(200).json({ message: "Booking created successfully!" });
  } catch (error) {
    console.error("Error creating user booking:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Fetch available slots for a given date
export const getBookingByDate = async (req, res) => {
  const { date } = req.params;

  try {
    // Strip time from the date and compare only the date part
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // Force time to start of the day in UTC
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999); // End of the day in UTC

    const booking = await Booking.findOne({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!booking) {
      return res.status(200).json({
        success: true,
        timeSlots: [], // No time slots if no booking found for this date
      });
    }

    res.status(200).json({
      success: true,
      timeSlots: booking.timeSlots, // Return the available time slots
    });
  } catch (error) {
    console.error("Error fetching booking by date:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch time slots" });
  }
};

export const getBookings = async (req, res) => {
  try {
    // Run cleanup of expired bookings before fetching new ones
    await cleanupExpiredBookings();
    const bookings = await Booking.find();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings" });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  const { date, timeSlots } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update date and time slots
    booking.date = new Date(date);
    booking.timeSlots = timeSlots;

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: "Error deleting booking" });
  }
};

// Cleanup expired bookings (bookings where the date has already passed)
export const cleanupExpiredBookings = async () => {
  try {
    // Get the current date and time
    const now = new Date();
    const todayDateString = now.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format
    const currentTime = now.getHours() + ":" + now.getMinutes(); // Get the current time in HH:mm format

    // Find all bookings for today and before
    const bookings = await Booking.find({ date: todayDateString });

    for (let booking of bookings) {
      // Filter out time slots that are already past the current time
      const updatedTimeSlots = booking.timeSlots.filter((slot) => {
        // Assuming time slots are in HH:mm format
        return slot > currentTime; // Keep future time slots
      });

      // If any time slots were removed, update the booking
      if (updatedTimeSlots.length !== booking.timeSlots.length) {
        booking.timeSlots = updatedTimeSlots;
        await booking.save();
        console.log(
          `Expired time slots removed for booking on ${booking.date}`
        );
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired time slots:", error);
  }
};

// Fetch all available booking dates
export const getAvailableBookingDates = async (req, res) => {
  try {
    // Fetch only the dates with bookings
    const bookings = await Booking.find({}, "date").sort({ date: 1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No available booking dates",
      });
    }

    // Return the dates only
    const availableDates = bookings.map((booking) => booking.date);
    res.status(200).json({
      success: true,
      availableDates,
    });
  } catch (error) {
    console.error("Error fetching available booking dates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking dates",
    });
  }
};
