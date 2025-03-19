import mongoose, { Schema, models } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      default: "Software Engineer",
    },
    location: {
      type: String,
      required: true,
      default: "Birmingham, AL",
    },
    department: {
      type: String,
      required: true,
      default: "Technology",
    },
    employmentType: {
      type: String,
      required: true,
      default: "Full Time - In Office",
    },
    reportsTo: {
      type: String,
      required: true,
      default: "CTO",
    },
    compensationRange: {
      type: String,
      required: true,
      default: "$55,000 - $85,000/year + Stock & Benefits",
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    resume: {
      type: String, // Store file name or URL (e.g., if uploaded to a service like S3)
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
    },
  },
  { timestamps: true }
);

const JobApplication = models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;