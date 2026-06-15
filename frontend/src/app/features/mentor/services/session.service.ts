import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionResponse } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
  private apiUrl = '/api/sessions';

  constructor(private http: HttpClient) {}

  // Retrieves all categorized session histories matching the current mentor
  getMySessions(): Observable<{ success: boolean; message: string; data: SessionResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: SessionResponse[] }>(`${this.apiUrl}/mentor/me`);
  }

  acceptSession(sessionId: number, meetingLink: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/accept`, { meetingLink });
  }

  rejectSession(sessionId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${sessionId}/reject`, {});
  }

  cancelOccurrence(occurrenceId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/occurrences/${occurrenceId}/cancel`, {});
  }
}