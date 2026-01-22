import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // 🔑 NEVER protect API routes here
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth");

  // Not logged in → block protected PAGES only
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Logged in → block auth pages
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
