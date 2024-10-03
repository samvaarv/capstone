import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    timeSlots: [{ type: String }], // Store available time slots
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);
