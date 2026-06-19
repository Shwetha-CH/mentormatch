export type SessionStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type PlanType      = 'SINGLE'  | 'DAILY'    | 'WEEKLY'    | 'MONTHLY';

export interface SessionMentor {
    id: number;
    fullName: string;
}

export interface Session {
    id: number;
    mentor: SessionMentor;
    topic: string;
    message: string;
    status: SessionStatus;
    planType: PlanType;
    totalOccurrences: number;
    rejectionReason: string;
    cancellationReason: string | null;
    createdAt: string;
    scheduledAt: string;        // first occurrence date
}
