import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/preview")) {
    // Allow any origin to embed preview pages in an iframe (for Directus preview panel).
    res.headers.delete("X-Frame-Options");
    res.headers.set("Content-Security-Policy", "frame-ancestors *");
  }

  return res;
}

export const config = {
  matcher: "/preview/:path*",
};
