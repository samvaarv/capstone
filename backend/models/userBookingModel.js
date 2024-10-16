import mongoose from "mongoose";

const userBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    details: { type: String }, // Additional booking details
  },
  { timestamps: true }
);

export default mongoose.model("UserBooking", userBookingSchema);
