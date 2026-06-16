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
  filteredMentors: AdminUser[] = [];  // ✅ ADDED
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';  // ✅ ADDED

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
        this.filteredMentors = data;  // ✅ CHANGED
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load mentors. Please try again.';
        this.loading = false;
        console.error('Error loading mentors:', err);
      }
    });
  }

  // ✅ ADDED
  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMentors = this.mentors;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredMentors = this.mentors.filter(mentor => 
      mentor.fullName.toLowerCase().includes(query) ||
      mentor.email.toLowerCase().includes(query)
    );
  }

  toggleStatus(mentor: AdminUser): void {
    this.adminService.toggleUserStatus(mentor.id).subscribe({
      next: (updatedUser) => {
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