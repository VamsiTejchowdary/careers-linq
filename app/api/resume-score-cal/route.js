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

    const contentType = req.headers.get("content-type");
    let jobId = null;
    let resumeUrl = null;
    let resumeBuffer = null;
    let resumeFilename = null;

    // Handle both JSON and multipart/form-data
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await req.json();
      jobId = jsonData.jobId;
      resumeUrl = jsonData.resumeUrl;
      console.log("JSON request received with resumeUrl:", resumeUrl);
    } else if (contentType && contentType.includes("multipart/form-data")) {
      const fields = {};
      const files = {};
      
      const busboy = Busboy({ headers: { "content-type": contentType } });
      const buffer = await req.arrayBuffer();
      const body = Buffer.from(buffer);

      await new Promise((resolve, reject) => {
        busboy.on("field", (name, value) => {
          fields[name] = value;
          console.log(`Received field: ${name}`);
        });
        
        busboy.on("file", (fieldname, file, info) => {
          const { filename, mimeType } = info;
          const chunks = [];
          file.on("data", (data) => chunks.push(data));
          file.on("end", () => {
            if (chunks.length > 0) {
              files[fieldname] = {
                filename: filename,
                buffer: Buffer.concat(chunks),
                mimeType: mimeType,
              };
              console.log(`File ${fieldname} processed, size: ${files[fieldname].buffer.length} bytes`);
            }
          });
        });
        
        busboy.on("finish", resolve);
        busboy.on("error", reject);
        busboy.end(body);
      });

      jobId = fields.jobId;
      resumeUrl = fields.resumeUrl;
      if (files.resume) {
        resumeBuffer = files.resume.buffer;
        resumeFilename = files.resume.filename || "uploaded-resume.pdf";
      }
    } else {
      return NextResponse.json({ 
        message: "Unsupported content type. Use multipart/form-data or application/json." 
      }, { status: 400 });
    }

    // Validate inputs
    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required." }, { status: 400 });
    }
    if (!resumeBuffer && !resumeUrl) {
      return NextResponse.json({ message: "Resume file or URL is required." }, { status: 400 });
    }

    // Fetch job details
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    // Build job description
    const jobDescription = buildJobDescription(job);
    console.log("Job description prepared, length:", jobDescription.length);

    // Handle resume from URL if no file uploaded
    if (!resumeBuffer && resumeUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const resumeResponse = await fetch(resumeUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 ApplicantMatching/1.0',
            'Accept': '*/*'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!resumeResponse.ok) {
          throw new Error(`Failed to fetch resume: ${resumeResponse.statusText}`);
        }
        
        resumeBuffer = Buffer.from(await resumeResponse.arrayBuffer());
        resumeFilename = resumeUrl.split("/").pop() || "resume.pdf";
        console.log("Resume fetched from URL, size:", resumeBuffer.length);
      } catch (fetchError) {
        console.error("Error fetching resume:", fetchError);
        return NextResponse.json({ 
          message: "Could not access resume URL",
          error: fetchError.message 
        }, { status: 400 });
      }
    }

    // Extract text from resume
    let resumeText = "";
    try {
      const fileExtension = resumeFilename.toLowerCase().split('.').pop() || 'pdf';
      
      if (fileExtension === 'pdf') {
        resumeText = await extractTextFromPdf(resumeBuffer);
      } else if (['doc', 'docx'].includes(fileExtension)) {
        resumeText = await extractTextFromDoc(resumeBuffer);
      } else {
        resumeText = resumeBuffer.toString('utf-8');
      }
      
      console.log("Resume text extracted, length:", resumeText.length);
      if (!resumeText || resumeText.length < 50) {
        console.warn("Limited text extracted from resume");
      }
    } catch (extractError) {
      console.error("Text extraction failed:", extractError);
      return NextResponse.json({ 
        message: "Failed to extract text from resume" 
      }, { status: 500 });
    }

    // Analyze resume fit
    const analysisResult = analyzeResumeFit(jobDescription, resumeText, job);
    
    return NextResponse.json({
      message: "Resume analysis completed successfully",
      ...analysisResult
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ 
      message: error.message || "An error occurred during resume analysis" 
    }, { status: 500 });
  }
}

// Build comprehensive job description
function buildJobDescription(job) {
  return [
    job.title || "",
    job.description || job.about || "",
    Array.isArray(job.responsibilities) ? job.responsibilities.join(" ") : "",
    Array.isArray(job.requirements) ? job.requirements.join(" ") : "",
    Array.isArray(job.niceToHaves) ? job.niceToHaves.join(" ") : "",
    Array.isArray(job.skills) ? job.skills.join(" ") : ""
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

// Extract text from PDF using Cloudmersive API
async function extractTextFromPdf(pdfBuffer) {
  try {
    const apiKey = process.env.CLOUDMERSIVE_API_KEY;
    if (!apiKey) throw new Error("CLOUDMERSIVE_API_KEY not configured");

    const response = await fetch("https://api.cloudmersive.com/convert/pdf/to/txt", {
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
    return data.TextResult || "";
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw error;
  }
}

// Placeholder for Word document extraction
async function extractTextFromDoc(docBuffer) {
  // TODO: Implement Word document extraction (e.g., using mammoth)
  throw new Error("Word document processing not implemented");
}

// Advanced resume analysis
function analyzeResumeFit(jobDescription, resumeText, job) {
  const normalizeText = (text) => 
    text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const jobDesc = normalizeText(jobDescription);
  const resume = normalizeText(resumeText);

  const extractKeywords = (text) => {
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
      'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by'
    ]);
    
    return text.split(' ')
      .filter(word => word.length > 2 && !stopWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
  };

  const jobKeywords = extractKeywords(jobDesc);
  const resumeKeywords = extractKeywords(resume);

  let matchedKeywords = 0;
  let totalWeight = 0;
  const keywordMatches = [];

  for (const [keyword, count] of Object.entries(jobKeywords)) {
    const weight = count;
    totalWeight += weight;
    if (resumeKeywords[keyword]) {
      matchedKeywords += weight;
      keywordMatches.push(keyword);
    }
  }

  const calculateSectionScore = (section, resumeText) => {
    if (!job[section] || !Array.isArray(job[section]) || !job[section].length) {
      return { score: 0, total: 0 };
    }
    
    const sectionText = job[section].join(' ');
    const sectionKeywords = extractKeywords(normalizeText(sectionText));
    
    let matched = 0;
    let total = 0;
    
    for (const [keyword, count] of Object.entries(sectionKeywords)) {
      total += count;
      if (resumeKeywords[keyword]) {
        matched += count;
      }
    }
    
    return { score: matched, total };
  };

  const requirementsMatch = calculateSectionScore('requirements', resume);
  const responsibilitiesMatch = calculateSectionScore('responsibilities', resume);
  const niceToHavesMatch = calculateSectionScore('niceToHaves', resume);

  const overallScore = Math.round((matchedKeywords / (totalWeight || 1)) * 100);
  const requirementsScore = Math.round((requirementsMatch.score / (requirementsMatch.total || 1)) * 100);
  const responsibilitiesScore = Math.round((responsibilitiesMatch.score / (responsibilitiesMatch.total || 1)) * 100);
  const niceToHavesScore = Math.round((niceToHavesMatch.score / (niceToHavesMatch.total || 1)) * 100);

  return {
    similarityScore: overallScore * 1.5,
    detailedScores: {
      requirementsMatch: requirementsScore,
      responsibilitiesMatch: responsibilitiesScore,
      niceToHavesMatch: niceToHavesScore
    },
    matchedKeywords: keywordMatches.slice(0, 10),
    totalKeywordsAnalyzed: Object.keys(jobKeywords).length
  };
}