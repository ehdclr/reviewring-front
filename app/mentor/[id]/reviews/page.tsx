"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//TODO 리뷰 더미데이터
const REVIEWS = [
  {
    id: 1,
    author: "김철수",
    rating: 5,
    content: "정말 도움이 많이 되었습니다. 상세한 피드백 감사합니다!",
    date: "2024-01-05",
  },
  {
    id: 2,
    author: "이영희",
    rating: 4,
    content: "전문적인 조언 감사합니다. 다만 피드백 시간이 조금 길었네요.",
    date: "2024-01-03",
  },
  {
    id: 3,
    author: "박지성",
    rating: 5,
    content: "멘토님의 피드백 덕분에 이력서가 훨씬 좋아졌어요!",
    date: "2024-01-01",
  },
];

export default function MentorReviews() {
  const { id } = useParams();
  const [reviews] = useState(REVIEWS);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">멘토 리뷰</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items=center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.author}`}
                    />
                    <AvatarFallback>{review.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{review.author}</CardTitle>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{review.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Button>리뷰 작성하기</Button>
      </div>
    </div>
  );
}
