import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
