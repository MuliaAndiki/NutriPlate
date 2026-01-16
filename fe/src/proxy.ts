import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/not-supported")) {
    return NextResponse.next();
  }

  const privateRoutes = [
    "/parent",
    "/kader",
    "/admin",
    "/posyandu",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (!isPrivateRoute) {
    return NextResponse.next();
  }
  const ua = req.headers.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad/i.test(ua);

  if (!isMobile) {
    return NextResponse.redirect(new URL("/not-supported", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/parent/:path*",
    "/kader/:path*",
    "/posyandu/:path*",
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/verify-otp/:path*",
    "/admin/:path*",
  ],
};
