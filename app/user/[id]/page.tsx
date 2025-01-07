'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  //사용자 정보 가져오기 
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
      } catch(err) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", err);
      }
    };
    
    if(id){
      fetchUserData();
    }
  }, [id]);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('사용자 정보 수정 api 호출해야됨')
    } catch(err) {
      console.error("사용자 정보를 업데이트하는 중 오류 발생:", err);
    }
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='flex items-center space-x-6'>
          <div className='relative w-32 h-32'>
            <Image
              src= {userData.profileImage || '/placeholder.svg'} 
              alt='사용자 프로필 이미지'
              layout='fill'
              objectFit='cover'
              className='rounded-full object-cover'
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>사용자 프로필</h1>
            <p className='text-gray-500'>{userData.name || 'Unknown User'}</p>
          </div>
        </div>  

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              value={userData.email}
              disabled={true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              value={userData.nickname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, nickname: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              name="phone"
              value={userData.phone}
              disabled={true}
            />
          </div>

          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <Button type="submit">저장</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>취소</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>수정</Button>
            )}
          </div>
        </form>
      </div>  
    </div>
  )
}
