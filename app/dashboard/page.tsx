"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Clock, FileText, Star, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">대시보드</h1>
          <p className="text-gray-600">
            안녕하세요, {session?.user?.name}님! 오늘도 좋은 하루 되세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/resume/submit">
            <Upload className="w-4 h-4 mr-2" />새 이력서 업로드
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="resumes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resumes">내 이력서</TabsTrigger>
          <TabsTrigger value="reviews">첨삭 결과</TabsTrigger>
          <TabsTrigger value="mentors">추천 멘토</TabsTrigger>
        </TabsList>

        <TabsContent value="resumes" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 이력서</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3개</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  진행중인 첨삭
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  완료된 첨삭
                </CardTitle>
                <Star className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1건</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>최근 이력서 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* {TODO 더미} */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rouded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">이력서_{i}.pdf</h3>
                        <p className="text-sm text-gray-500">
                          업로드: 2024.01.0{i}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      보기
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>첨삭 결과 모음</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Star className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h3 className="font-medium">이력서_{i} 첨삭 피드백</h3>
                        <p className="text-sm text-gray-500">
                          멘토: 김멘토 • 완료일: 2024.01.0{i}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      피드백 확인
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=Mentor${i}`}
                      />
                      <AvatarFallback>M{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">김멘토_{i}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        <Briefcase className="w-4 h-4 inline-block mr-1" />
                        경력 {i + 4}년 • IT 개발자
                      </p>
                      <p className="text-sm mb-4">
                        실무 경험을 바탕으로 실질적인 피드백을 제공합니다.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < 4 ? "text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            4.0 (15 리뷰)
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          프로필 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
