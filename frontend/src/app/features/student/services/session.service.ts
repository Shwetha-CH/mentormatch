// src/app/features/student/services/session.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface SessionRequest {
    mentorId: number;
    topic: string;
    message?: string;
    planType: string;
    totalOccurrences: number;
}

export interface SessionResponse {
    id: number;
    topic: string;
    message: string;
    status: string;
    planType: string;
    totalOccurrences: number;
    createdAt: string;
    mentorId: number;
    mentorName: string;
    studentId: number;
    studentName: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {

    private readonly API = 'http://localhost:8081/api/sessions';

    constructor(private http: HttpClient) {}

    // POST /api/sessions — Book a session
    bookSession(request: SessionRequest): Observable<SessionResponse> {
        return this.http
            .post<ApiResponse<SessionResponse>>(this.API, request)
            .pipe(map(res => res.data));
    }

    // GET /api/sessions/my — Student's sessions
    getMySessions(): Observable<SessionResponse[]> {
        return this.http
            .get<ApiResponse<SessionResponse[]>>(`${this.API}/my`)
            .pipe(map(res => res.data));
    }

    // GET /api/sessions/mentor — Mentor's sessions
    getMentorSessions(): Observable<SessionResponse[]> {
        return this.http
            .get<ApiResponse<SessionResponse[]>>(`${this.API}/mentor`)
            .pipe(map(res => res.data));
    }
}