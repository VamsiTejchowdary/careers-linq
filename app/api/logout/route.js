import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Sign-out successful." },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire the cookie immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "An error occurred during sign-out." }, { status: 500 });
  }
}