import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  subHeading: { type: String, required: true },
  heading: { type: String, required: true },
  quote: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String, required: true }, // Path to the first image
  image2: { type: String, required: true }, // Path to the second image
  pros: { type: [String], required: true }, // Array of pros
  cons: { type: [String], required: true }, // Array of cons
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);
