import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MentorProfile, MentorFilter } from '../models/mentor.model';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class MentorService {

    private readonly API = 'http://localhost:8081/api/mentors';

    constructor(private http: HttpClient) {}

    // GET /api/mentors?industry=&minRating=&skill=
    getMentors(filters: MentorFilter = {}): Observable<MentorProfile[]> {
        let params = new HttpParams();
        if (filters.industry)  params = params.set('industry',  filters.industry);
        if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
        if (filters.skill)     params = params.set('skill',     filters.skill);

        return this.http.get<ApiResponse<MentorProfile[]>>(this.API, { params })
            .pipe(map(res => res.data));
    }

    // GET /api/mentors/{id}
    getMentorById(id: number): Observable<MentorProfile> {
        return this.http.get<ApiResponse<MentorProfile>>(`${this.API}/${id}`)
            .pipe(map(res => res.data));
    }

    // GET /api/mentors/recommended
    getRecommended(): Observable<MentorProfile[]> {
        return this.http.get<ApiResponse<MentorProfile[]>>(`${this.API}/recommended`)
            .pipe(map(res => res.data));
    }
}