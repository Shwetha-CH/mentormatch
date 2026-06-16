// src/app/features/mentor/services/session.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionResponse } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
  private apiUrl = 'http://localhost:8081/api/sessions';

  constructor(private http: HttpClient) {}

  getMySessions(): Observable<{ success: boolean; message: string; data: SessionResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: SessionResponse[] }>(`${this.apiUrl}/mentor`);
  }

  acceptSession(sessionId: number, meetingLink: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/accept`, { meetingLink });
  }

  rejectSession(sessionId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/reject`, {});
  }

  // Mark session as COMPLETED — only mentor can do this
  completeSession(sessionId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/complete`, {});
  }

  cancelOccurrence(occurrenceId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/occurrences/${occurrenceId}/cancel`, {});
  }
}