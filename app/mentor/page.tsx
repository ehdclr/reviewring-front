//TODO 멘토 목록 페이지
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// 임시 멘토 데이터
const mentors = [
  { id: 1, name: "김멘토", category: "IT/개발", rating: 4.8 },
  { id: 2, name: "이멘토", category: "디자인", rating: 4.5 },
  // ... 더 많은 멘토 데이터
];

export default function MentorList() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleMentorRequest = (mentorId: number) => {
    // TODO: 멘토링 요청 처리 로직
    console.log(`Requesting mentor ${mentorId} for ${selectedDate?.toDateString()} at ${selectedTime}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">멘토 목록</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${mentor.name}`} />
                  <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{mentor.name}</CardTitle>
                  <Badge>{mentor.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">평점: {mentor.rating}/5.0</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">멘토링 요청</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{mentor.name} 멘토와 화상 멘토링 예약</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {["10:00", "14:00", "19:00"].map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <Button onClick={() => handleMentorRequest(mentor.id)} className="w-full">
                      예약 확정
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}