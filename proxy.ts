import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLogged = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;

  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  if (isPublic && isLogged) {
    return NextResponse.redirect(new URL("/catalogo", req.url));
  }

  if (pathname.startsWith("/adm")) {
    if (!isLogged) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/catalogo", req.url));
    }

    return NextResponse.next();
  }


  if (!isPublic && !isLogged) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};