// src/app/models/review.model.ts

export type ReviewerRole = 'STUDENT' | 'MENTOR';

export interface ReviewResponse {
    id: number;
    sessionId: number;
    reviewerId: number;
    reviewerName: string;
    reviewerPhotoUrl: string | null;
    rating: number;
    comment: string | null;
    reviewerRole: ReviewerRole;
    createdAt: string;
}

export interface ReviewRequest {
    rating: number;
    comment?: string;
}