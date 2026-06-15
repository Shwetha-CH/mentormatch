// src/app/features/admin/models/admin-session.model.ts

export interface AdminSession {
  sessionId: number;
  mentorName: string;
  mentorEmail: string;
  studentName: string;
  studentEmail: string;
  topic: string;
  status: string;
  planType: string;
  totalOccurrences: number;
  createdAt: string;
  occurrences?: SessionOccurrence[];
}

export interface SessionOccurrence {
  occurrenceId: number;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  status: string;
}