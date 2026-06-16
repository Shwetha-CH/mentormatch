import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { SessionService, SessionResponse } from '../../services/session.service';
import { StudentProfile } from '../../models/student-profile.model';
import { Session } from '../../models/session.model';
import { AuthService } from "../../../../core/services/auth.service";

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

  recentSessions: any[] = [];


  constructor(
      private studentService: StudentService,
      private sessionService: SessionService,
      private router: Router,
      private authService: AuthService,
  ) {}

  ngOnInit(): void {
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
    this.sessionService.getMySessions().subscribe({
      next: (p) => {
        const Sessions = p || [];
        this.recentSessions = Sessions.length>3?
        Sessions.slice(-3).reverse():Sessions;
      },
      error: () => {
        this.errorMsg = 'Failed to load sessions data ';
      }
    });
    this.sessionService.getMySessions().subscribe({
      next: (p) => {
        const session = p || [];
        for (const s of session) {
          const st = s.status;
          this.stats.totalSessions += 1; // always increment
          if (st === 'PENDING') {
            this.stats.pending += 1;
          } else if (st === 'COMPLETED') {
            this.stats.completed += 1;
          } else if (st === 'ACCEPTED') {
            this.stats.upcoming += 1; // example mapping
          }
        }
      },
      error: () => {
        this.errorMsg = 'Failed to stats ';
      }
    })

  }

  get initials(): string {
    return (this.profile?.fullName ?? 'S')
        .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  }
  getInitials(name: string): string {
    return (name ?? 'M').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
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
  logout() {
        this.authService.logout();
    }
  getDurationLabel(mins: number): string {
    return mins === 120 ? '2 hrs' : '1 hr';
  }
}