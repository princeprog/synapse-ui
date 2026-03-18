import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = new Set(["/login", "/register"]);
const AUTHENTICATED_HOME = "/workspace";
const UNAUTHENTICATED_HOME = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  if (pathname === "/") {
    const destination = isAuthenticated ? AUTHENTICATED_HOME : UNAUTHENTICATED_HOME;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(AUTHENTICATED_HOME, request.url));
  }

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL(UNAUTHENTICATED_HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
