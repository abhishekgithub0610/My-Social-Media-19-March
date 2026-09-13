import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("RefreshToken")?.value;

  const pathname = request.nextUrl.pathname;

  const isPublicPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
