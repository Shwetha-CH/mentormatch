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
    jobTitle: string;
    company: string;
    skills: string[];
    isAvailable: boolean;
    profilePhotoUrl: string;
    rating: number;
}

export interface MentorFilter {
    industry?: string;
    minRating?: number;
    skill?: string;
}