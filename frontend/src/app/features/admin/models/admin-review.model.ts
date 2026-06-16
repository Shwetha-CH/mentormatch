// src/app/features/admin/models/admin-review.model.ts

export interface AdminReview {
  id: number;
  sessionId: number;
  reviewerName: string;
  reviewerEmail: string;
  revieweeName: string;
  revieweeEmail: string;
  rating: number;
  comment: string;
  reviewerRole: string;
  createdAt: string;
}