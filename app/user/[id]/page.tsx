"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Camera, Loader2, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  profileImage: string;
}

export default function UserPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<User>({
    id: 0,
    email: "",
    name: "",
    nickname: "",
    phone: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${Number(id)}`);
        const data = await response.json();
        if (data.success) {
          setUserData(data.payload);
        } else {
          console.error("사용자 정보를 가져오는 중 오류 발생:", data.message);
        }
      } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", err);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = URL.createObjectURL(file);
      setUserData((prev) => ({ ...prev, profileImage: imageUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("사용자 정보 수정 api 호출해야됨");
    } catch (err) {
      console.error("사용자 정보를 업데이트하는 중 오류 발생:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container max-w-3xl mx-auto p-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="relative p-0">
            <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background" />
            <div className="absolute -bottom-16 left-6">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage
                    src={userData.profileImage || "/placeholder.svg"}
                    alt="프로필 이미지"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-b from-primary/10 to-primary/5">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-white flex flex-col items-center gap-1">
                      <Camera className="w-6 h-6" />
                      <span className="text-xs">변경</span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-20">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {userData.name || "Unknown User"}
                </h1>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>
              <Separator />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={cn(
                        "bg-background transition-colors",
                        !isEditing && "bg-muted"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      name="email"
                      value={userData.email}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input
                      id="nickname"
                      name="nickname"
                      value={userData.nickname}
                      onChange={(e) =>
                        setUserData({ ...userData, nickname: e.target.value })
                      }
                      disabled={!isEditing}
                      className={cn(
                        "bg-background transition-colors",
                        !isEditing && "bg-muted"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="submit"
                        className="w-24"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "저장"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="w-24"
                        disabled={isUploading}
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-24"
                    >
                      수정
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
