import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import Job from "@/models/JobPosting";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    await connectMongoDB();

    const fields = {};
    const files = {};
    const contentType = req.headers.get("content-type");

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Expected multipart/form-data." }, { status: 400 });
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    const buffer = await req.arrayBuffer();
    const body = Buffer.from(buffer);

    await new Promise((resolve, reject) => {
      busboy.on("field", (name, value) => (fields[name] = value));
      busboy.on("file", (fieldname, file, info) => {
        const { filename, mimeType } = info;
        const chunks = [];
        file.on("data", (data) => chunks.push(data));
        file.on("end", () => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExt = filename.match(/\.[^.]+$/);
          const extension = fileExt ? fileExt[0] : "";
          const newFilename = `${fieldname}-${uniqueSuffix}${extension}`;
          files[fieldname] = {
            filename: newFilename,
            buffer: Buffer.concat(chunks),
            mimetype: mimeType,
          };
        });
      });
      busboy.on("finish", resolve);
      busboy.on("error", reject);
      busboy.end(body);
    });

    const { name, email, phone, linkedin, portfolio, coverLetter, jobId, similarityScore, resumeUrl } = fields;

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    if (email) {
      const emailExists = await JobApplication.findOne({ jobId, email });
      if (emailExists) {
        return NextResponse.json({ message: "You have already applied for this position." }, { status: 409 });
      }
    }

    let finalResumeUrl = resumeUrl; // Use provided URL if no new file is uploaded
    if (files.resume) {
      const resumeFile = files.resume;
      console.log("Uploading new resume:", resumeFile.filename);
      const blob = await put(resumeFile.filename, resumeFile.buffer, {
        access: "public",
        contentType: resumeFile.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      finalResumeUrl = blob.url;
    }

    if (!finalResumeUrl) {
      console.log("No resume provided or uploaded.");
      return NextResponse.json({ message: "Resume is required." }, { status: 400 });
    }

    const jobApplication = await JobApplication.create({
      name,
      email,
      phone,
      linkedin,
      coverLetter,
      portfolio,
      resume: finalResumeUrl,
      jobId,
      similarityScore,
    });

    return NextResponse.json(
      {
        message: "Job application submitted successfully.",
        applicationId: jobApplication._id,
        similarityScore: jobApplication.similarityScore,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message || "An error occurred." }, { status: 500 });
  }
}