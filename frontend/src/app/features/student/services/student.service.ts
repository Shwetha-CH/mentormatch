import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfile, UpdateStudentRequest } from '../models/student-profile.model';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private readonly API = 'http://localhost:8081/api/students';

  constructor(private http: HttpClient) {}

  // GET /api/students/me
  getProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.API}/me`);
  }

  // PUT /api/students/me
  updateProfile(req: UpdateStudentRequest): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.API}/me`, req);
  }
  deleteProfile():Observable<any>{
    return this.http.delete(`${this.API}/me`);
  }
}