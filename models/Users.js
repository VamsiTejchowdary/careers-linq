import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, "Please enter a valid LinkedIn URL"],
    },
    portfolio: {
      type: String,
      trim: true,
      default: "",
      match: [/^https?:\/\/.+$/, "Please enter a valid URL"],
    },
    resume: {
      type: String, // Store file path or URL if uploaded to a storage service
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);



const Users = models.Users || mongoose.model("Users", userSchema);
export default Users;