import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
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
      throw new Error("Expected multipart/form-data.");
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    const buffer = await req.arrayBuffer();
    const body = Buffer.from(buffer);

    await new Promise((resolve, reject) => {
      busboy.on("field", (name, value) => (fields[name] = value));
      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        const chunks = [];
        file.on("data", (data) => chunks.push(data));
        file.on("end", () => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const newFilename = `${fieldname}-${uniqueSuffix}${filename.filename.match(/\.[^.]+$/)[0]}`;
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

    const { name, email, phone, linkedin, coverLetter, jobId } = fields;

    let resumeUrl = null;
    if (files.resume) {
      const resumeFile = files.resume;
      const blob = await put(resumeFile.filename, resumeFile.buffer, {
        access: "public",
        contentType: resumeFile.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass the token
      });
      resumeUrl = blob.url;
    } else {
      return NextResponse.json({ message: "Resume is required." }, { status: 400 });
    }

    const jobApplication = await JobApplication.create({
      name,
      email,
      phone,
      linkedin,
      coverLetter,
      resume: resumeUrl,
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
    console.error("Error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}