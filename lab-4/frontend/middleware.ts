import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicPaths = ["/"].includes(pathname);

  if (publicPaths && token) {
    return NextResponse.redirect(new URL("/board", origin));
  }
  if (!token && !publicPaths) {
    return NextResponse.redirect(new URL("/", origin));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/board"],
};
