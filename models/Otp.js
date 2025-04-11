// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "5m" }, // Auto-delete after 5 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Index for faster sorting
  },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);