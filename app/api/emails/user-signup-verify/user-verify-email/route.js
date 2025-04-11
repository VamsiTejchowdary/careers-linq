// app/api/emails/user-signup-verify/user-verify-email/route.js
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email });

    // Generate 4-character alphanumeric OTP
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Store new OTP in MongoDB
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      createdAt: new Date(), // Explicitly set for clarity
    });

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send OTP email
    await resend.emails.send({
      from: "Career Clutch <no-reply@vamsitejchowdary.com>", // Replace with your verified domain
      to: email,
      subject: "Verify Your Career Clutch Account",
      html: `
        <div style="font-family: Arial, sans-serif; color: #ffffff; background: linear-gradient(to bottom right, #4b6cb7, #182848); padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #ffffff;">Career Clutch</h2>
          <p style="color: #d1d5db;">Your verification code is:</p>
          <h3 style="color: #a5b4fc; font-size: 24px; letter-spacing: 2px;">${otp}</h3>
          <p style="color: #d1d5db;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ message: error.message || "Failed to send OTP." }, { status: 500 });
  }
}