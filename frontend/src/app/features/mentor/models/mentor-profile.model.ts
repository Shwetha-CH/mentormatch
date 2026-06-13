export interface MentorUser {
  id: number;
  fullName: string;
  email: string;
}

export interface MentorProfile {
  id: number;
  user: MentorUser;
  bio: string;
  industry: string;
  hourlyRate: number | null;
  skills: string[];
  isAvailable: boolean;
  rating: number;
}

export interface MentorProfileRequest {
  bio: string;
  industry: string;
  hourlyRate: number | null;
  skills: string[];
}
