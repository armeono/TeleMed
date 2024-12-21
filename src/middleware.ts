import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;

  const user = cookies.get("user")?.value;

  if (
    ["/login", "/register"].includes(request.nextUrl.pathname) &&
    user !== undefined
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    if (["/login", "/register"].includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
