import { connectMongoDB } from "@/lib/mongodb";
import Job from "@/models/JobPosting";
import { NextResponse } from "next/server";
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
    console.log("Connected to MongoDB");

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
          const fileExt = filename.filename?.match(/\.[^.]+$/)?.[0] || ".pdf";
          const newFilename = `${fieldname}-${uniqueSuffix}${fileExt}`;
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

    const { jobId, resumeUrl } = fields;

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required." }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    const jobDescription = `
      ${job.about || ""}
      ${(job.responsibilities || []).join(" ")}
      ${(job.niceToHaves || []).join(" ")}
    `.trim();
    console.log("Job description length:", jobDescription.length);

    let resumeBuffer;
    let resumeFilename;

    if (files.resume) {
      resumeBuffer = files.resume.buffer;
      resumeFilename = files.resume.filename;
      console.log("Resume file uploaded:", resumeFilename, "Size:", resumeBuffer.length);
    } else if (resumeUrl) {
      console.log("Fetching resume from URL:", resumeUrl);
      const resumeResponse = await fetch(resumeUrl);
      if (!resumeResponse.ok) {
        throw new Error(`Failed to fetch resume from URL: ${resumeResponse.statusText}`);
      }
      resumeBuffer = Buffer.from(await resumeResponse.arrayBuffer());
      resumeFilename = resumeUrl.split("/").pop() || "resume.pdf";
      console.log("Resume fetched, size:", resumeBuffer.length);
    } else {
      return NextResponse.json({ message: "Resume is required." }, { status: 400 });
    }

    let resumeText = "";
    const isPdf = resumeFilename.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      console.log("Extracting text from PDF using Cloudmersive API");
      try {
        resumeText = await extractTextFromPdf(resumeBuffer);
        console.log("Extracted PDF text length:", resumeText.length);
        console.log("Extracted text preview:", resumeText.substring(0, 100)); // Log first 100 chars
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return NextResponse.json({ message: "Failed to extract resume text." }, { status: 500 });
      }
    } else {
      resumeText = "Non-PDF resume uploaded";
      console.log("Non-PDF resume detected, using placeholder text");
    }

    let similarityScore = 0;
    if (resumeText && resumeText.length > 0 && resumeText !== "Non-PDF resume uploaded") {
      console.log("Calculating similarity between job description and resume");
      similarityScore = calculateSimilarity(jobDescription, resumeText);
      console.log("Final similarity score:", similarityScore);
    } else {
      console.log("No valid resume text extracted, similarity score remains 0");
    }

    return NextResponse.json(
      {
        message: "Similarity score calculated successfully.",
        similarityScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message || "An error occurred." }, { status: 500 });
  }
}

async function extractTextFromPdf(pdfBuffer) {
  try {
    console.log("Sending PDF to Cloudmersive API, buffer size:", pdfBuffer.length);

    const apiKey = process.env.CLOUDMERSIVE_API_KEY;
    if (!apiKey) throw new Error("CLOUDMERSIVE_API_KEY is not set.");

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
      const errorText = await response.text();
      throw new Error(`Cloudmersive API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const extractedText = data.TextResult || "";
    console.log("PDF processed, text length:", extractedText.length);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF with Cloudmersive:", error);
    throw error;
  }
}

function calculateSimilarity(jobDescription, resumeText) {
  const jobWords = new Set(jobDescription.toLowerCase().split(/\s+/).filter(Boolean));
  const resumeWords = new Set(resumeText.toLowerCase().split(/\s+/).filter(Boolean));

  const intersection = new Set([...jobWords].filter((word) => resumeWords.has(word)));
  const union = new Set([...jobWords, ...resumeWords]);

  const similarity = intersection.size / union.size;
  return Math.round(similarity * 100);
}