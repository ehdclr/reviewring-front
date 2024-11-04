import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
export default withAuth(
  async function middleware(req: NextRequest) {
    //TODO 이미 로그인한 사용자가 다시 /signin 페이지로 접근하는 경우 대시보드로 리다이렉트
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