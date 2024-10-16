import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store user email or ID
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'contact', 'reply'], required: true }, // Add type field
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
