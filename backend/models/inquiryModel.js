import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    subject: String,
    message: String,
    replied: { type: Boolean, default: false }, // To track if the inquiry has a reply
    replies: [
      {
        replyMessage: String,
        repliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
