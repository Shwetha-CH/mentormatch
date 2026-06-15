import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Session } from '../models/session.model';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class SessionService {

    private readonly API = 'http://localhost:8081/api';

    constructor(private http: HttpClient) {}

    // TODO: Replace dummy with real call when endpoint is ready:
    // return this.http.get<ApiResponse<Session[]>>(`${this.API}/students/me/sessions`)
    //   .pipe(map(res => res.data));
    getMySessions(): Observable<Session[]> {
        return of(DUMMY_SESSIONS);
    }

    // TODO: Replace with:
    // return this.http.get<ApiResponse<Session>>(`${this.API}/sessions/${id}`)
    //   .pipe(map(res => res.data));
    getSessionById(id: number): Observable<Session> {
        return of(DUMMY_SESSIONS.find(s => s.id === id) ?? DUMMY_SESSIONS[0]);
    }

    // TODO: Replace with:
    // return this.http.patch(`${this.API}/sessions/${id}/cancel`, {});
    cancelSession(id: number): Observable<void> {
        return of(void 0);
    }
}

// ─── DUMMY DATA — replace when GET /api/students/me/sessions is ready ───
const DUMMY_SESSIONS: Session[] = [
    {
        id: 1,
        mentor: { id: 1, fullName: 'Arjun Sharma' },
        topic: 'System Design Interview Prep',
        message: 'I want to improve my interview preparation.',
        status: 'ACCEPTED', planType: 'WEEKLY', totalOccurrences: 4,
        rejectionReason: '', createdAt: '2026-06-01T10:00:00', scheduledAt: '2026-06-15T10:00:00'
    },
    {
        id: 2,
        mentor: { id: 2, fullName: 'Priya Nair' },
        topic: 'Java Spring Boot Fundamentals',
        message: 'Need help with Spring Boot basics and REST APIs.',
        status: 'PENDING', planType: 'SINGLE', totalOccurrences: 1,
        rejectionReason: '', createdAt: '2026-06-08T14:00:00', scheduledAt: '2026-06-12T14:00:00'
    },
    {
        id: 3,
        mentor: { id: 3, fullName: 'Rahul Verma' },
        topic: 'DSA Problem Solving',
        message: 'Want to improve problem solving for coding rounds.',
        status: 'COMPLETED', planType: 'DAILY', totalOccurrences: 5,
        rejectionReason: '', createdAt: '2026-05-20T11:00:00', scheduledAt: '2026-05-25T11:00:00'
    },
    {
        id: 4,
        mentor: { id: 4, fullName: 'Sneha Reddy' },
        topic: 'AWS Cloud Fundamentals',
        message: 'Want to learn AWS for my upcoming project.',
        status: 'REJECTED', planType: 'SINGLE', totalOccurrences: 1,
        rejectionReason: 'Mentor is unavailable for this time slot.',
        createdAt: '2026-05-15T09:00:00', scheduledAt: '2026-05-18T09:00:00'
    },
    {
        id: 5,
        mentor: { id: 5, fullName: 'Karthik Iyer' },
        topic: 'Machine Learning Basics',
        message: 'Interested in starting ML with Python.',
        status: 'CANCELLED', planType: 'WEEKLY', totalOccurrences: 3,
        rejectionReason: 'Student requested cancellation.',
        createdAt: '2026-05-10T15:00:00', scheduledAt: '2026-05-14T15:00:00'
    }
];
