"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { useState } from "react";

// 임시 요청 데이터
const initialRequests = [
  {
    id: 1,
    mentee: "홍길동",
    date: "2024-03-15",
    time: "14:00",
    type: "화상 멘토링",
  },
  {
    id: 2,
    mentee: "김철수",
    date: "2024-03-16",
    time: "10:00",
    type: "이력서 첨삭",
  },
  // ... 더 많은 요청 데이터
];

export default function MentorRequests() {
  const [requests, setRequests] = useState(initialRequests);

  const handleAccept = (id: number) => {
    // TODO: 요청 수락 처리 로직
    console.log(`Accepted request ${id}`);
  };

  const handleReject = (id: number) => {
    // TODO: 요청 거절 처리 로직
    console.log(`Rejected request ${id}`);
  };

  const handleShareLink = (id: number) => {
    // TODO: 화상 통화 링크 공유 로직
    console.log(`Sharing link for request ${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">멘토링 요청 관리</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle>{request.mentee}님의 멘토링 요청</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p>날짜: {request.date}</p>
                  <p>시간: {request.time}</p>
                  <Badge>{request.type}</Badge>
                </div>
                <div className="space-x-2">
                  <Button onClick={() => handleAccept(request.id)} size="sm">
                    <Check className="w-4 h-4 mr-2" /> 수락
                  </Button>
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" /> 거절
                  </Button>
                </div>
              </div>
              {request.type === "화상 멘토링" && (
                <div className="mt-4">
                  <Input placeholder="화상 통화 링크 입력" className="mb-2" />
                  <Button
                    onClick={() => handleShareLink(request.id)}
                    variant="outline"
                    size="sm"
                  >
                    링크 공유
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
