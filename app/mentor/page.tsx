"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dummyCategories } from "@/datas/categories";
import { dummyMentors } from "@/datas/mentors";
import { Category, type Mentor } from "@/types/mentor";
import { FileText, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function MentorList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<
    "mentoring" | "resumeReview"
  >("mentoring");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // TODO: 멘토리스트 불러오기
        // const response = await fetch("/api/mentors");
        // const data = await response.json();
        setMentors(dummyMentors);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setCategories(dummyCategories);
      } catch (err) {
        console.error("카테고리 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
    fetchCategories();
  }, []);

  const filteredMentors = mentors.filter(
    (mentor) =>
      selectedCategory === "all" || mentor.categories.includes(selectedCategory)
  );

  const handleMentorRequest = async (mentorId: number) => {
    try {
      // TODO : 예약하는 API 호출
      // const response = await fetch("/api/bookings", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     mentorId,
      //     date: selectedDate,
      //     time: selectedTime,
      //     serviceType: selectedService,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to book session");
      // }

      console.log("예약 API 호출");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">멘토 목록</h1>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory === category.type ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category.type)}
              className="px-4"
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      mentor.profileImage ||
                      `https://api.dicebear.com/6.x/initials/svg?seed=${mentor.name}`
                    }
                  />
                  <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <CardTitle className="flex items-center">
                    {mentor.name}
                    <div className="flex items-center ml-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                      {mentor.rating}
                    </div>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {mentor.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {categories.find((c) => c.type === category)?.name ||
                          category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex gap-2 mb-4">
                {mentor.services.mentoring && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    멘토링
                  </Badge>
                )}
                {mentor.services.resumeReview && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    이력서 첨삭
                  </Badge>
                )}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-auto">예약하기</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{mentor.name} 멘토와 예약하기</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Tabs
                      defaultValue="mentoring"
                      className="w-full"
                      onValueChange={(value) =>
                        setSelectedService(
                          value as "mentoring" | "resumeReview"
                        )
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="mentoring"
                          disabled={!mentor.services.mentoring}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          멘토링
                        </TabsTrigger>
                        <TabsTrigger
                          value="resumeReview"
                          disabled={!mentor.services.resumeReview}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          이력서 첨삭
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <Separator />

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
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleMentorRequest(mentor.id)}
                      className="w-full"
                      disabled={!selectedDate || !selectedTime}
                    >
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
