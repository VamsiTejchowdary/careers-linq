import { connectMongoDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import Job from "@/models/JobPosting";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import Busboy from "busboy";
import fetch from "node-fetch";

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
          const fileExt = filename.filename.match(/\.[^.]+$/);
          const extension = fileExt ? fileExt[0] : "";
          const newFilename = `${fieldname}-${uniqueSuffix}${extension}`;
          files[fieldname] = {
            filename: newFilename,
            buffer: Buffer.concat(chunks),
            mimetype,
          };
        });
      });
      busboy.on("finish", resolve);
      busboy.on("error", reject);
      busboy.end(body);
    });

    const { name, email, phone, linkedin, coverLetter, jobId } = fields;

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }
    const jobDescription = `
      ${job.about || ""} 
      ${(job.responsibilities || []).join(" ")} 
      ${(job.niceToHaves || []).join(" ")}
    `.trim();

    if (!files.resume) {
      return NextResponse.json({ message: "Resume is required." }, { status: 400 });
    }

    const resumeFile = files.resume;
    console.log("Resume file mimetype:", resumeFile.mimetype);
    console.log("Resume filename:", resumeFile.filename);
    console.log("Buffer length:", resumeFile.buffer.length);

    const blob = await put(resumeFile.filename, resumeFile.buffer, {
      access: "public",
      contentType: resumeFile.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const resumeUrl = blob.url;
    let resumeText = "";

    const isPdf = resumeFile.filename?.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      console.log("Extracting text from PDF using Cloudmersive API");
      try {
        resumeText = await extractTextFromPdf(resumeFile.buffer);
        console.log("Extracted PDF text length:", resumeText.length);
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        resumeText = "PDF parsing failed, using placeholder";
      }
    } else {
      resumeText = "Non-PDF resume uploaded";
    }

    let similarityScore = 0;
    if (resumeText && resumeText.length > 0 && resumeText !== "Non-PDF resume uploaded") {
      console.log("Calculating similarity between job description and resume");
      similarityScore = calculateSimilarity(jobDescription, resumeText);
      console.log("Final similarity score:", similarityScore);
    }

    const jobApplication = await JobApplication.create({
      name,
      email,
      phone,
      linkedin,
      coverLetter,
      resume: resumeUrl,
      jobId,
      similarityScore,
    });

    return NextResponse.json(
      {
        message: "Job application submitted successfully.",
        applicationId: jobApplication._id,
        similarityScore,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message || "An error occurred." }, { status: 500 });
  }
}

// Extract text from PDFs using Cloudmersive Convert API
async function extractTextFromPdf(pdfBuffer) {
  try {
    console.log("Sending PDF to Cloudmersive API, buffer size:", pdfBuffer.length);

    const apiKey = process.env.CLOUDMERSIVE_API_KEY;
    const url = "https://api.cloudmersive.com/convert/pdf/to/txt";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Apikey": apiKey,
        "Content-Type": "application/pdf",
      },
      body: pdfBuffer,
    });

    if (!response.ok) {
      throw new Error(`Cloudmersive API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const extractedText = data.TextResult || "";
    console.log("PDF processed, pages not provided by API, text length:", extractedText.length);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF with Cloudmersive:", error);
    throw error;
  }
}

// Jaccard Similarity
function calculateSimilarity(jobDescription, resumeText) {
  const jobWords = new Set(jobDescription.toLowerCase().split(/\s+/).filter(Boolean));
  const resumeWords = new Set(resumeText.toLowerCase().split(/\s+/).filter(Boolean));

  const intersection = new Set([...jobWords].filter((word) => resumeWords.has(word)));
  const union = new Set([...jobWords, ...resumeWords]);

  const similarity = intersection.size / union.size;
  return Math.round(similarity * 100*4); // Scale to 0-100
}