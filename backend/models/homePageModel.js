import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  heroTitle: { type: String, required: true },
  heroDescription: { type: String, required: true },
  heroImage1: { type: String, required: true },
  heroImage2: { type: String, required: true },
  aboutTitle: { type: String, required: true },
  aboutDescription: { type: String, required: true },
  aboutImage: { type: String, required: true },
  instagramBigImage: { type: String, required: true },
  instagramSmallImages: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.model("Homepage", homepageSchema);
