// src/app/features/admin/models/broadcast-request.model.ts

export interface BroadcastRequest {
  targetAudience: 'ALL' | 'STUDENT' | 'MENTOR';
  title: string;
  message: string;
}