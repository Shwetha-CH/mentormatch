// src/app/features/admin/components/mentors/mentors.component.ts

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/admin-user.model';

@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.css']
})
export class MentorsComponent implements OnInit {
  
  mentors: AdminUser[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadMentors();
  }

  loadMentors(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getUsersByRole('MENTOR').subscribe({
      next: (data) => {
        this.mentors = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load mentors. Please try again.';
        this.loading = false;
        console.error('Error loading mentors:', err);
      }
    });
  }

  toggleStatus(mentor: AdminUser): void {
    this.adminService.toggleUserStatus(mentor.id).subscribe({
      next: (updatedUser) => {
        // Update the local mentor object
        mentor.isActive = updatedUser.isActive;
      },
      error: (err) => {
        console.error('Error toggling mentor status:', err);
        alert('Failed to update mentor status');
      }
    });
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