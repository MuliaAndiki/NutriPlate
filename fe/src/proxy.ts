import { NextRequest, NextResponse } from "next/server";

const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|mobile/i;

function isMobileRequest(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const chUaMobile = request.headers.get("sec-ch-ua-mobile") || "";
  return chUaMobile === "?1" || MOBILE_UA.test(ua);
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const isMobile = isMobileRequest(req);

  if (pathname.startsWith("/not-supported")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    url.pathname = isMobile ? "/home" : "/landing";
    return NextResponse.redirect(url);
  }

  if (pathname === "/home" && !isMobile) {
    url.pathname = "/landing";
    return NextResponse.redirect(url);
  }

  if (pathname === "/landing" && isMobile) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
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
    "/home",
  ];

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  if (!isMobile) {
    return NextResponse.redirect(new URL("/not-supported", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/landing",
    "/parent/:path*",
    "/kader/:path*",
    "/posyandu/:path*",
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/verify-otp/:path*",
    "/admin/:path*",
    "/home/:path*",
  ],
};
