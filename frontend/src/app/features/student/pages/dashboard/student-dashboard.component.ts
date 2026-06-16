// src/app/features/student/pages/dashboard/student-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { SessionService, SessionResponse } from '../../services/session.service';
import { StudentProfile } from '../../models/student-profile.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  profile: StudentProfile | null = null;
  loading = true;
  errorMsg = '';

  stats = {
    totalSessions: 0,
    upcoming: 0,
    pending: 0,
    completed: 0
  };

  recentSessions: SessionResponse[] = [];

  constructor(
      private studentService: StudentService,
      private sessionService: SessionService,
      private router: Router
  ) {}

  ngOnInit(): void {
    // Load profile
    this.studentService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load dashboard.';
        this.loading = false;
      }
    });

    // Load real session data
    this.sessionService.getMySessions().subscribe({
      next: (sessions) => {
        this.stats.totalSessions = sessions.length;
        this.stats.upcoming  = sessions.filter(s => s.status === 'ACCEPTED').length;
        this.stats.pending   = sessions.filter(s => s.status === 'PENDING').length;
        this.stats.completed = sessions.filter(s => s.status === 'COMPLETED').length;
        // Most recent 3 sessions
        this.recentSessions = sessions.slice(0, 3);
      },
      error: () => {} // Non-critical — fail silently
    });
  }

  get initials(): string {
    return (this.profile?.fullName ?? 'S')
        .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  get firstName(): string {
    return this.profile?.fullName?.split(' ')[0] ?? 'there';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ACCEPTED:  'status-accepted',
      PENDING:   'status-pending',
      COMPLETED: 'status-completed',
      REJECTED:  'status-rejected',
      CANCELLED: 'status-cancelled'
    };
    return map[status] ?? '';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Date TBD';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getDurationLabel(mins: number): string {
    return mins === 120 ? '2 hrs' : '1 hr';
  }
}