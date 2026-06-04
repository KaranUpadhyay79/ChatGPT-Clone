import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["signup", "login"],
    required: true,
  },
  // Pending signup data (sirf signup ke liye)
  pendingUser: {
    username: String,
    password: String, // Already hashed
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // ✅ MongoDB TTL — 10 min baad auto delete
  },
});

// Ek email ke liye ek hi OTP hona chahiye
otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

export default mongoose.model("Otp", otpSchema);