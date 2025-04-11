// app/api/user-signup/route.js
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/Users";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import Busboy from "busboy";
import bcrypt from "bcrypt";

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

    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      linkedin,
      portfolio,
      password,
      confirmPassword,
    } = fields;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country || !password) {
      return NextResponse.json({ message: "All required fields must be provided." }, { status: 400 });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered." }, { status: 409 });
    }

    // Check if resume file is provided
    if (!files.resume) {
      return NextResponse.json({ message: "Resume is required." }, { status: 400 });
    }

    const resumeFile = files.resume;

    // Upload resume to Vercel Blob
    const blob = await put(resumeFile.filename, resumeFile.buffer, {
      access: "public",
      contentType: resumeFile.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const resumeUrl = blob.url;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      country,
      linkedin: linkedin || "",
      portfolio: portfolio || "",
      resume: resumeUrl,
      password: hashedPassword,
      isVerified: true,
    });

    // Call the send-welcome-email API
    try {
      const emailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/emails/user-sign-up/send-welcome-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error("Failed to send welcome email:", await emailResponse.text());
      }
    } catch (emailError) {
      console.error("Error calling email API:", emailError);
    }

    return NextResponse.json(
      {
        message: "User registered successfully.",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message || "An error occurred." }, { status: 500 });
  }
}