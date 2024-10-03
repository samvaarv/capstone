import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    images: [{ type: String, required: true }], // Array of image paths
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
