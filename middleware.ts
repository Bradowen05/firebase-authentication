import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./lib/session";

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);

  const { pathname } = request.nextUrl;

  // If user is trying to access /dashboard but not logged in, redirect to /login
  if (pathname.startsWith("/dashboard")) {
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is trying to access /login but already logged in, redirect to /dashboard
  if (pathname.startsWith("/login")) {
    if (session.isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
