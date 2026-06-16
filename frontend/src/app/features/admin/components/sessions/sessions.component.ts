// src/app/features/admin/components/sessions/sessions.component.ts

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminSession } from '../../models/admin-session.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  
  sessions: AdminSession[] = [];
  filteredSessions: AdminSession[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedStatus: string = 'ALL';
  searchQuery: string = '';

  statusOptions = [
    { value: 'ALL', label: 'All Sessions' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getAllSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sessions. Please try again.';
        this.loading = false;
        console.error('Error loading sessions:', err);
      }
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.sessions;

    // Filter by status
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(session => session.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.studentName.toLowerCase().includes(query) ||
        session.mentorName.toLowerCase().includes(query) ||
        session.studentEmail.toLowerCase().includes(query) ||
        session.mentorEmail.toLowerCase().includes(query) ||
        session.topic.toLowerCase().includes(query)
      );
    }

    this.filteredSessions = filtered;
  }

  // ── ADMIN ACTIONS ─────────────────────────────────────────

  cancelSession(session: AdminSession): void {
    if (!confirm(`Cancel session "${session.topic}"?\n\nStudent: ${session.studentName}\nMentor: ${session.mentorName}`)) {
      return;
    }

    this.adminService.cancelSession(session.sessionId).subscribe({
      next: (response) => {
        // Update local data
        const index = this.sessions.findIndex(s => s.sessionId === session.sessionId);
        if (index !== -1) {
          this.sessions[index].status = 'CANCELLED';
        }
        this.applyFilters();
        alert('Session cancelled successfully! ✅');
      },
      error: (err) => {
        console.error('Error cancelling session:', err);
        alert('Failed to cancel session. ' + (err.error?.message || 'Please try again.'));
      }
    });
  }

  forceCompleteSession(session: AdminSession): void {
    if (!confirm(`Force complete session "${session.topic}"?\n\nThis will mark the session as completed.`)) {
      return;
    }

    this.adminService.forceCompleteSession(session.sessionId).subscribe({
      next: (response) => {
        // Update local data
        const index = this.sessions.findIndex(s => s.sessionId === session.sessionId);
        if (index !== -1) {
          this.sessions[index].status = 'COMPLETED';
        }
        this.applyFilters();
        alert('Session marked as completed! ✅');
      },
      error: (err) => {
        console.error('Error completing session:', err);
        alert('Failed to complete session. Please try again.');
      }
    });
  }

  deleteSession(session: AdminSession): void {
    if (!confirm(`⚠️ DELETE session "${session.topic}"?\n\nThis action cannot be undone!\n\nStudent: ${session.studentName}\nMentor: ${session.mentorName}`)) {
      return;
    }

    this.adminService.deleteSession(session.sessionId).subscribe({
      next: () => {
        // Remove from local array
        this.sessions = this.sessions.filter(s => s.sessionId !== session.sessionId);
        this.applyFilters();
        alert('Session deleted successfully! ✅');
      },
      error: (err) => {
        console.error('Error deleting session:', err);
        alert('Failed to delete session. Please try again.');
      }
    });
  }

  // ── HELPERS ───────────────────────────────────────────────

  canCancel(session: AdminSession): boolean {
    return session.status === 'PENDING' || session.status === 'ACCEPTED';
  }

  canForceComplete(session: AdminSession): boolean {
    return session.status !== 'COMPLETED';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'ACCEPTED': 'status-accepted',
      'COMPLETED': 'status-completed',
      'REJECTED': 'status-rejected',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getPlanTypeClass(planType: string): string {
    const planMap: { [key: string]: string } = {
      'SINGLE': 'plan-single',
      'WEEKLY': 'plan-weekly',
      'MONTHLY': 'plan-monthly'
    };
    return planMap[planType] || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}