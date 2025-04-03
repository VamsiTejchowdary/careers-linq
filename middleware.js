import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // List of protected routes
  const protectedRoutes = ["/careers"];

  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/user/signin", request.url));
    }

    try {
      // Verify the token using jose
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next(); // Proceed to the protected route
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/user/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/careers/:path*"],
};