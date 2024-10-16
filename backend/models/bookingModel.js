import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlots: [{
    type: String, // This will store an array of strings
    required: true
  }]
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
