export interface OccurrenceSummary {
  id: number;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
}

export interface SessionResponse {
  sessionId: number;
  studentName: string;
  studentEmail: string;
  topic: string;
  planType: 'SINGLE' | 'WEEKLY' | 'MONTHLY';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  totalOccurrences: number;
  occurrences: OccurrenceSummary[];
}