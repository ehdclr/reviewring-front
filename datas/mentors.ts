import { Mentor } from "@/types/mentor";

export const dummyMentors: Mentor[] = [
  {
    id: 1,
    name: "김멘토",
    categories: ["frontend", "backend"],
    rating: 4.9,
    profileImage: "/mentors/mentor1.jpg",
    services: {
      mentoring: true,
      resumeReview: true,
    },
    introduction: "10년차 풀스택 개발자",
    career: "네이버, 카카오",
  },
  {
    id: 2,
    name: "이디자인",
    categories: ["design"],
    rating: 4.8,
    profileImage: "/mentors/mentor2.jpg",
    services: {
      mentoring: true,
      resumeReview: false,
    },
    introduction: "UI/UX 디자인 전문가",
    career: "토스",
  },
  {
    id: 3,
    name: "박프론트",
    categories: ["frontend"],
    rating: 4.7,
    services: {
      mentoring: true,
      resumeReview: true,
    },
    introduction: "프론트엔드 개발 리드",
    career: "쿠팡",
  },
  {
    id: 4,
    name: "최백엔드",
    categories: ["backend"],
    rating: 4.9,
    services: {
      mentoring: true,
      resumeReview: true,
    },
    introduction: "백엔드 아키텍트",
    career: "라인",
  },
  {
    id: 5,
    name: "정모바일",
    categories: ["mobile"],
    rating: 4.6,
    services: {
      mentoring: true,
      resumeReview: false,
    },
    introduction: "iOS/Android 개발자",
    career: "당근마켓",
  },
  {
    id: 6,
    name: "한기획",
    categories: ["pm"],
    rating: 4.8,
    services: {
      mentoring: true,
      resumeReview: true,
    },
    introduction: "프로덕트 매니저",
    career: "배달의민족",
  },
  {
    id: 7,
    name: "송개발",
    categories: ["frontend", "mobile"],
    rating: 4.7,
    services: {
      mentoring: false,
      resumeReview: true,
    },
    introduction: "크로스플랫폼 개발 전문가",
    career: "뱅크샐러드",
  },
  {
    id: 8,
    name: "강디자인",
    categories: ["design"],
    rating: 4.9,
    services: {
      mentoring: true,
      resumeReview: true,
    },
    introduction: "브랜딩 디자인 전문가",
    career: "카카오",
  },
  {
    id: 9,
    name: "윤풀스택",
    categories: ["frontend", "backend"],
    rating: 4.8,
    services: {
      mentoring: true,
      resumeReview: true,
    },
    introduction: "풀스택 개발 리드",
    career: "쏘카",
  },
];
