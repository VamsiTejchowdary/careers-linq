import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    console.log("Connected to MongoDB");

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const email = searchParams.get("email");
    console.log("jobId:", jobId);
    console.log("email:", email);

    if (!jobId || !email) {
      return NextResponse.json(
        { message: "Missing jobId or email." },
        { status: 400 }
      );
    }

    const existingApplication = await JobApplication.findOne({ jobId, email });

    const alreadyApplied = !!existingApplication;

    return NextResponse.json(
      {
        applied: alreadyApplied,
        message: alreadyApplied
          ? "User has already applied to this job."
          : "User has not applied to this job.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/check-job-applied:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}