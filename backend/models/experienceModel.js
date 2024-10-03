import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImage: { type: String, required: true },
    caption: { type: String, required: true },
    experiences: [
      {
        number: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    gallery: [{ type: String }], // Array for gallery images
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
