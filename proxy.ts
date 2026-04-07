import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ========== middleware for route protection & session mgmt ==========
export default function proxy(req: NextRequest) {
  // ========== retrieve session from cookies to check auth status ==========
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // ========== api pass ==========
  if (pathname.startsWith("/api")) return NextResponse.next();

  // ========== route classfication ==========
  const isPublic = pathname === "/" || pathname.startsWith("/auth");

  // ========== protection logic ==========
  if (!session && !isPublic)
    return NextResponse.redirect(new URL("/auth", req.url));

  if (session && pathname.startsWith("/auth"))
    return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
}

// ========== matcher config ==========
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
