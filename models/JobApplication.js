import mongoose, { Schema, models } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      default: "",
    },
    similarityScore: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const JobApplication = models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
