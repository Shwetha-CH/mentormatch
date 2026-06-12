export interface StudentProfile {
  id: number;
  fullName: string;
  email: string;
  headline: string;
  goals: string;
  interests: string;
  currentRole: string;
  totalSessions: number;
}

export interface UpdateStudentRequest {
  headline: string;
  goals: string;
  interests: string;
  currentRole: string;
}