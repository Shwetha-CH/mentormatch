// src/app/features/admin/models/admin-stats.model.ts

export interface AdminStats {
  totalUsers: number;
  totalMentors: number;
  totalStudents: number;
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
}