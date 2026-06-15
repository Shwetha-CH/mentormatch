// src/app/features/admin/models/admin-user.model.ts

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  profilePhotoUrl?: string;
}

export interface AdminUserDetail extends AdminUser {
  headline?: string;
  totalSessions?: number;
  // For mentors
  expertiseTags?: string;
  avgRating?: number;
  // For students
  currentRole?: string;
  goals?: string;
  rating?: number; 
}