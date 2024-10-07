// bookingController.js
import Booking from "../models/bookingModel.js";
import UserBooking from "../models/userBookingModel.js";
import sendgrid from "@sendgrid/mail";

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
          return res.status(200).json({ success: true, message: "Booking deleted since no time slots selected" });
        } else {
          return res.status(400).json({ success: false, message: "No booking to delete" });
        }
      }
  
      if (existingBooking) {
        // Update the existing booking if time slots are provided
        existingBooking.timeSlots = timeSlots;
        await existingBooking.save();
        return res.status(200).json({ success: true, message: "Booking updated successfully", booking: existingBooking });
      } else {
        // Create a new booking
        const newBooking = new Booking({ date, timeSlots });
        await newBooking.save();
        return res.status(201).json({ success: true, message: "Booking created successfully", booking: newBooking });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      return res.status(500).json({ success: false, message: "Error creating booking" });
    }
  };
  
  // Create user booking
export const createUserBooking = async (req, res) => {
  const { userId, serviceId, date, timeSlot, details } = req.body;

  try {
    const adminBooking = await Booking.findOne({ date });
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
    adminBooking.timeSlots = adminBooking.timeSlots.filter(slot => slot !== timeSlot);
    await adminBooking.save();

    // Send email notification to the user (implement email logic here)

    res.status(200).json({ message: "Booking created successfully!" });
  } catch (error) {
    console.error("Error creating user booking:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};
  
  // Get booking by date
  export const getBookingByDate = async (req, res) => {
    const { date } = req.params;
    try {
      const booking = await Booking.findOne({ date: new Date(date) });
      if (booking) {
        res.status(200).json({ success: true, timeSlots: booking.timeSlots });
      } else {
        res.status(404).json({ success: false, message: "No booking found for this date" });
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ success: false, message: "Error fetching booking" });
    }
  };

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Error fetching bookings" });
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
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: "Error deleting booking" });
  }
};
