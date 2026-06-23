import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLogged = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/adm");
  console.log(isAdminRoute + " " + isLogged + " " + role);

  if(isAdminRoute && (!isLogged || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/adm/:path*"],
}