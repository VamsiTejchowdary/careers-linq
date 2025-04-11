import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required." }, { status: 400 });
    }


    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json({ message: "No OTP found for this email." }, { status: 400 });
    }


    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json({ message: "OTP has expired." }, { status: 400 });
    }


    if (otpRecord.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }


    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: "OTP verified successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ message: error.message || "Failed to verify OTP." }, { status: 500 });
  }
}