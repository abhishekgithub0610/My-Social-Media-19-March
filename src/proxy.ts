import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("RefreshToken")?.value;

  const pathname = request.nextUrl.pathname;

  const isPublicPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  //pending : uncomment before live
  // if (!refreshToken && !isPublicPage) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }

  // if (refreshToken && isPublicPage) {
  //   return NextResponse.redirect(new URL("/feed", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};

// export function proxy(request: NextRequest) {
//   const token = request.cookies.get("AccessToken")?.value;

//   const pathname = request.nextUrl.pathname;

//   const isPublicPage =
//     pathname === "/" ||
//     pathname.startsWith("/sign-in") ||
//     pathname.startsWith("/register");

//   // ❌ Not logged in → redirect
//   if (!token && !isPublicPage) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // ✅ Logged in → block auth pages
//   if (token && isPublicPage && pathname !== "/") {
//     return NextResponse.redirect(new URL("/feed/home", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
// };
