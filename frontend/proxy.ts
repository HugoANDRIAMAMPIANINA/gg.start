import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile/me"];
const authRoutes = ["/auth/login", "auth/register"];

export default async function proxy(request: NextRequest) {
  // Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const sessionExists = request.cookies.has("session");

  // Redirect to /auth/login (the login route) if the user is not authenticated
  if (isProtectedRoute && !sessionExists) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  // Redirect to / (the home page) if the user is already authenticated
  if (isAuthRoute && sessionExists) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
