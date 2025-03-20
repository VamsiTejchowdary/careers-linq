// pages/api/create-job.js
import { connectMongoDB } from '@/lib/mongodb';
import JobPosting from '@/models/JobPosting';
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

    await connectMongoDB();

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
    await connectMongoDB();

    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const id = searchParams.get("id");

    if (id) {
      const jobPosting = await JobPosting.findById(id);
      if (!jobPosting) {
        return NextResponse.json({ message: "Job posting not found" }, { status: 404 });
      }
      return NextResponse.json(jobPosting, { status: 200 });
    } else {
      const jobPostings = await JobPosting.find({});
      return NextResponse.json(jobPostings, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while fetching job postings." },
      { status: 500 }
    );
  }
}