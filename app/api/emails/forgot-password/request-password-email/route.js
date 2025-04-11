import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import User from "@/models/Users";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Email not registered." }, { status: 404 });
    }


    await Otp.deleteMany({ email });


    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 100000-999999


    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
      createdAt: new Date(),
    });


    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Career Clutch <no-reply@vamsitejchowdary.com>", 
      to: email,
      subject: "Reset Your Career Clutch Password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #ffffff; background: linear-gradient(to bottom right, #4b6cb7, #182848); padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #ffffff;">Career Clutch</h2>
          <p style="color: #d1d5db;">Your password reset code is:</p>
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