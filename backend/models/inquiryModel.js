// models/inquiryModel.js
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
