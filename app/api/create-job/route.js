import { connectMongoDB } from '../../../lib/mongodb'; // Import connectMongoDB function
import JobPosting from '@/models/JobPosting'; // Import JobPosting model
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const {
      jobTitle,
      location,
      department,
      employmentType,
      reportsTo,
      compensationRange,
      about,
      responsibilities,
      niceToHaves,
    } = await req.json();

    // Connect to MongoDB
    console.log("Ikkadiki Vachindhi...");
    await connectMongoDB();

    // Create a new job posting
    const jobPosting = await JobPosting.create({
      jobTitle,
      location,
      department,
      employmentType,
      reportsTo,
      compensationRange,
      about,
      responsibilities,
      niceToHaves,
    });

    return NextResponse.json(
      { message: "Job posting created.", job_id: jobPosting._id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while creating the job posting." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all job postings
    const jobPostings = await JobPosting.find({});

    return NextResponse.json(jobPostings, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while fetching job postings." },
      { status: 500 }
    );
  }
}