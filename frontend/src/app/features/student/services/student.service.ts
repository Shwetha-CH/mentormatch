import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfile } from '../models/student-profile.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = 'http://localhost:8081/api/students';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<StudentProfile>> {
    return this.http.get<ApiResponse<StudentProfile>>(`${this.API_URL}/me`);
  }

  updateProfile(profile: Partial<StudentProfile>): Observable<ApiResponse<StudentProfile>> {
    return this.http.put<ApiResponse<StudentProfile>>(`${this.API_URL}/me`, profile);
  }
}
