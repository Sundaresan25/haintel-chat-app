import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Allow the login page always
  if (pathname === "/login") {
    if (token) {
      // If already logged in, redirect to dashboard
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // For all other pages, redirect to login if not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
