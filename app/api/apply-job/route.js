import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import JobPosting from "@/models/JobPosting";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

export async function POST(req) {
  console.log("Inside apply-job POST");

  try {
    await connectMongoDB();
    console.log("Connected to MongoDB");


    //console.log("Request Headers:", Object.fromEntries(req.headers));

    // Parse the multipart/form-data request with busboy
    const fields = {};
    const files = {};

    // Ensure Content-Type exists and is multipart/form-data
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      throw new Error("Invalid or missing Content-Type header. Expected multipart/form-data.");
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    const buffer = await req.arrayBuffer();
    const body = Buffer.from(buffer);

    await new Promise((resolve, reject) => {
      busboy.on("field", (name, value) => {
        fields[name] = value;
      });

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        const chunks = [];
        file.on("data", (data) => chunks.push(data));
        file.on("end", () => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const newFilename = `${fieldname}-${uniqueSuffix}${path.extname(filename.filename)}`;
          files[fieldname] = {
            filename: newFilename,
            buffer: Buffer.concat(chunks),
            mimetype,
          };
        });
      });

      busboy.on("finish", () => resolve());
      busboy.on("error", (err) => reject(err));

      busboy.end(body);
    });

    //console.log("Parsed Form Data:", { fields, files });

    
    const { name, email, phone, linkedin, coverLetter, jobId } = fields;

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required." }, { status: 400 });
    }

    // Check if the job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Invalid Job ID." }, { status: 404 });
    }

    // Handle file upload
    let resumePath = null;
    if (files.resume) {
      const resumeFile = files.resume;
      const filePath = `/uploads/${resumeFile.filename}`;
      resumePath = filePath;

      await writeFile(
        path.join(process.cwd(), "public", filePath),
        resumeFile.buffer
      );
    } else {
      return NextResponse.json({ message: "Resume is required." }, { status: 400 });
    }

    // Create job application
    const jobApplication = await JobApplication.create({
      name,
      email,
      phone,
      linkedin,
      coverLetter,
      resume: resumePath,
      jobId,
    });

    return NextResponse.json(
      {
        message: "Job application submitted successfully.",
        applicationId: jobApplication._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/apply-job:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while submitting the application." },
      { status: 500 }
    );
  }
}