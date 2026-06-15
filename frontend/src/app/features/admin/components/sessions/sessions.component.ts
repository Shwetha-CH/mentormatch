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
        this.filteredSessions = data;
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
    if (this.selectedStatus === 'ALL') {
      this.filteredSessions = this.sessions;
    } else {
      this.filteredSessions = this.sessions.filter(
        session => session.status === this.selectedStatus
      );
    }
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
      'DAILY': 'plan-daily',
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