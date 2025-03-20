import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("Inside get-job-applications GET");

  try {
    await connectMongoDB();
    console.log("Connected to MongoDB");

    // Fetch all job applications and populate jobId with jobTitle and department from JobPosting
    const applications = await JobApplication.find().populate({
      path: "jobId",
      select: "jobTitle department", // Fetch jobTitle and department from JobPosting
    });

    return NextResponse.json(
      {
        message: "Job applications retrieved successfully.",
        applications: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/get-job-applications:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while fetching applications." },
      { status: 500 }
    );
  }
}