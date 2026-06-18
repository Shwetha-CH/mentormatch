// src/app/features/mentor/services/session.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionResponse } from '../models/session.model';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
  private apiUrl = `${environment.apiUrl}/api/sessions`;

  constructor(private http: HttpClient) {}

  getMySessions(): Observable<{ success: boolean; message: string; data: SessionResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: SessionResponse[] }>(`${this.apiUrl}/mentor`);
  }

  acceptSession(sessionId: number, meetingLink: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/accept`, { meetingLink });
  }

  rejectSession(sessionId: number, reason: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/reject`, { reason });
  }

  // Mark session as COMPLETED — only mentor can do this
  completeSession(sessionId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/complete`, {});
  }

  // Mentor cancels a session with a mandatory reason
  cancelSession(sessionId: number, reason: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/mentor-cancel`, { reason });
  }

  cancelOccurrence(occurrenceId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/occurrences/${occurrenceId}/cancel`, {});
  }
}