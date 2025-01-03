import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
export default withAuth(
  async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname === "/signin" && req.nextUrl.searchParams.get("callbackUrl") === "/signin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {

  pages: {
    signIn: "/signin",
    error: "/",
  },
});

export const config = {
  matcher: ["/dashboard", "/upload-resume", "/review-resume", "/review-result", "/register-reviewer"],
};