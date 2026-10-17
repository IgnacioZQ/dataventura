import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const session = request.auth;
  if (!session?.user) return NextResponse.redirect(new URL("/login", request.nextUrl));
  if (request.nextUrl.pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/session/:path*", "/review/:path*", "/profile/:path*", "/admin/:path*"]
};
