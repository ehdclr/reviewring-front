"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut, FileText, Star, Users } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

 //로그아웃 next-auth

  return (
    <header className="bg-[#1A1B1E] text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          <span className="text-xl font-bold">리뷰링</span>
        </Link>
        <nav className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/mentor" className="text-sm hover:text-gray-300">
                멘토 찾기
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-gray-300">
                    <UserCircle className="w-5 h-5 mr-2" />
                    {session.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={`/user/${session.user.id}`} className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      마이 페이지
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      내 이력서
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reviews" className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      첨삭 결과
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mentor/register" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      멘토 등록
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/signin">로그인</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}