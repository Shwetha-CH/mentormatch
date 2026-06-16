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
  filteredStudents: AdminUser[] = [];  // ✅ ADDED
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';  // ✅ ADDED

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
        this.filteredStudents = data;  // ✅ CHANGED
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load students. Please try again.';
        this.loading = false;
        console.error('Error loading students:', err);
      }
    });
  }

  // ✅ ADDED
  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredStudents = this.students;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.fullName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  }

  toggleStatus(student: AdminUser): void {
    this.adminService.toggleUserStatus(student.id).subscribe({
      next: (updatedUser) => {
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