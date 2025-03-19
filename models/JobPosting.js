import mongoose, { Schema, models } from "mongoose";

const jobPostingSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      required: true,
    },
    reportsTo: {
      type: String,
      required: true,
    },
    compensationRange: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      required: true,
    },
    niceToHaves: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const JobPosting = models.JobPosting || mongoose.model("JobPosting", jobPostingSchema);
export default JobPosting;