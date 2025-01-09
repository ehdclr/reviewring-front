export interface Category {
  id: number;
  type: string;
  name: string;
}

export interface Mentor {
  id: number;
  name: string;
  categories: string[];
  rating: number;
  profileImage?: string;
  services: {
    mentoring: boolean;
    resumeReview: boolean;
  };
  introduction?: string;
  career?: string;
}
