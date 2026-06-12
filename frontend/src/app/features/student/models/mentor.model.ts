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
    skills: string[];
    isAvailable: boolean;
    rating: number;
}

export interface MentorFilter {
    industry?: string;
    minRating?: number;
    skill?: string;
}
