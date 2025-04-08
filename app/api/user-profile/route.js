import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/Users";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { put } from "@vercel/blob";
import Busboy from "busboy";

export async function GET(req) {
  try {
    await connectMongoDB();
    console.log("Connected to MongoDB:", process.env.MONGODB_URI);
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Expected multipart/form-data." }, { status: 400 });
    }

    // Parse multipart form data
    const fields = {};
    const files = {};
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

    const { firstName, lastName, email, phone, linkedin, portfolio } = fields;
    let updateData = { firstName, lastName, email, phone, linkedin, portfolio };

    // Handle resume file upload if provided
    if (files.resume) {
      const resumeFile = files.resume;
      console.log("Resume file mimetype:", resumeFile.mimetype);
      console.log("Resume filename:", resumeFile.filename);
      console.log("Buffer length:", resumeFile.buffer.length);

      // Upload resume to Vercel Blob
      const blob = await put(resumeFile.filename, resumeFile.buffer, {
        access: "public",
        contentType: resumeFile.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      updateData.resume = blob.url; // Add the new resume URL to the update data
    }

    // Update user in the database
    const user = await User.findByIdAndUpdate(
      payload.userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, message: "Profile updated" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}