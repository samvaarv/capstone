import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store user email or ID
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
