import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/utils"; // Assuming a utility function for token validation

const PUBLIC_PATHS = [
  "/auth",
  "/auth/",
  "/auth/login",
  "/auth/signup",
  "/auth/reset-password",
  "/auth/verify-email",
  "/landing",
  "/api/auth",
  "/api/auth/",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect /api routes except /api/auth
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token || !validateToken(token)) {
      return NextResponse.json({ error: "Unauthorized: Invalid or missing token" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect main app routes
  if (!pathname.startsWith("/auth") && !pathname.startsWith("/landing")) {
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token || !validateToken(token)) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", sanitizeRedirect(pathname));
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Helper function to sanitize redirect paths
function sanitizeRedirect(path: string): string {
  // Allow only internal paths
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|public).*)", "/api/:path*"],
};
