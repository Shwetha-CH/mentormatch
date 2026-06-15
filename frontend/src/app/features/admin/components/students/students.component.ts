// src/app/features/admin/components/students/students.component.ts

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/admin-user.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  
  students: AdminUser[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getUsersByRole('STUDENT').subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load students. Please try again.';
        this.loading = false;
        console.error('Error loading students:', err);
      }
    });
  }

  toggleStatus(student: AdminUser): void {
    this.adminService.toggleUserStatus(student.id).subscribe({
      next: (updatedUser) => {
        // Update the local student object
        student.isActive = updatedUser.isActive;
      },
      error: (err) => {
        console.error('Error toggling student status:', err);
        alert('Failed to update student status');
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