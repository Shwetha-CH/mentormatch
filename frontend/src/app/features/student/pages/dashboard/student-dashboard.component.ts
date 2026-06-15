import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { StudentProfile } from '../../models/student-profile.model';
import {AuthService} from "../../../../core/services/auth.service";

// ─── TODO: Replace with real session API response type when ready ───
export interface SessionSummary {
  id: number;
  mentorName: string;
  topic: string;
  scheduledAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  planType: 'SINGLE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  profile: StudentProfile | null = null;
  loading = true;
  errorMsg = '';

  // ─── DUMMY session stats — replace with GET /api/students/me/sessions ───
  stats = {
    totalSessions: 8,       // TODO: sessions.length
    upcoming: 2,            // TODO: filter status === 'ACCEPTED' & future date
    pending: 1,             // TODO: filter status === 'PENDING'
    completed: 5            // TODO: filter status === 'COMPLETED'
  };

  // ─── DUMMY recent sessions — replace with GET /api/students/me/sessions ───
  recentSessions: SessionSummary[] = [
    {
      id: 1,
      mentorName: 'Arjun Sharma',
      topic: 'System Design Interview Prep',
      scheduledAt: '2026-06-15T10:00:00',
      status: 'ACCEPTED',
      planType: 'WEEKLY'
    },
    {
      id: 2,
      mentorName: 'Priya Nair',
      topic: 'Java Spring Boot Fundamentals',
      scheduledAt: '2026-06-12T14:00:00',
      status: 'PENDING',
      planType: 'SINGLE'
    },
    {
      id: 3,
      mentorName: 'Rahul Verma',
      topic: 'DSA Problem Solving',
      scheduledAt: '2026-06-08T11:00:00',
      status: 'COMPLETED',
      planType: 'DAILY'
    }
  ];

  quickActions = [
    { label: 'Browse Mentors',   icon: '🔍', route: '/student/mentors'  },
    { label: 'My Sessions',      icon: '📅', route: '/student/sessions' },
    { label: 'Edit Profile',     icon: '✏️',  route: '/student/profile'  },
    { label: 'Notifications',    icon: '🔔', route: '/student/notifications' }
  ];

  constructor(
      private studentService: StudentService,
      private router: Router,
      private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.studentService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        // ─── TODO: When session API is ready, also call:
        // this.sessionService.getMySessions().subscribe(sessions => {
        //   this.stats.totalSessions = sessions.length;
        //   this.stats.upcoming  = sessions.filter(s => s.status === 'ACCEPTED').length;
        //   this.stats.pending   = sessions.filter(s => s.status === 'PENDING').length;
        //   this.stats.completed = sessions.filter(s => s.status === 'COMPLETED').length;
        //   this.recentSessions  = sessions.slice(0, 3);
        // });
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load dashboard.';
        this.loading = false;
      }
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
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  logout() {
    this.authService.logout();
  }
}