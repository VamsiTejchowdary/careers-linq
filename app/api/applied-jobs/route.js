import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication"; // Assuming you have a JobApplication model
import JobPosting from "@/models/JobPosting"; // Assuming you have a JobPosting model
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Extract email from query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find all job applications for the given email
    const applications = await JobApplication.find({ email }).lean();
    if (!applications.length) {
      return NextResponse.json(
        { message: "No job applications found for this email" },
        { status: 404 }
      );
    }

    
    const jobIds = applications.map((app) => app.jobId);

   
    const jobPostings = await JobPosting.find({
      _id: { $in: jobIds },
    //   isActive: true, // Only fetch active job postings
    }).lean();


    const jobPostingsMap = jobPostings.reduce((acc, job) => {
      acc[job._id.toString()] = job;
      return acc;
    }, {});


    const appliedJobs = applications.map((app) => {
      const job = jobPostingsMap[app.jobId.toString()] || null;
      return {
        applicationId: app._id,
        jobId: app.jobId,
        applicantName: app.name,
        email: app.email,
        phone: app.phone,
        linkedin: app.linkedin || null,
        portfolio: app.portfolio || null,
        resume: app.resume || null,
        coverLetter: app.coverLetter || null,
        similarityScore: app.similarityScore,
        appliedAt: app.createdAt,
        jobDetails: job
          ? {
              jobTitle: job.jobTitle,
              location: job.location,
              department: job.department,
              employmentType: job.employmentType,
              reportsTo: job.reportsTo,
              compensationRange: job.compensationRange,
              about: job.about,
              responsibilities: job.responsibilities || [],
              niceToHaves: job.niceToHaves || [],
              createdAt: job.createdAt,
              isActive: job.isActive,
            }
          : null,
      };
    });

    const validAppliedJobs = appliedJobs.filter((job) => job.jobDetails !== null);

    return NextResponse.json(
      {
        message: "Applied jobs retrieved successfully",
        data: validAppliedJobs,
        total: validAppliedJobs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching applied jobs" },
      { status: 500 }
    );
  }
}