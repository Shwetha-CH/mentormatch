// src/app/features/admin/components/broadcast/broadcast.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent {
  
  broadcastForm: FormGroup;
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  audienceOptions = [
    { value: 'ALL', label: '👥 All Users', description: 'Send to all students and mentors' },
    { value: 'STUDENT', label: '👨‍🎓 Students Only', description: 'Send to all students' },
    { value: 'MENTOR', label: '👨‍🏫 Mentors Only', description: 'Send to all mentors' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.broadcastForm = this.fb.group({
      targetAudience: ['ALL', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  get targetAudience() { return this.broadcastForm.get('targetAudience'); }
  get title() { return this.broadcastForm.get('title'); }
  get message() { return this.broadcastForm.get('message'); }

  onSubmit(): void {
    if (this.broadcastForm.invalid) {
      this.broadcastForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request = this.broadcastForm.value;

    this.adminService.sendBroadcast(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = `Notification sent successfully to ${request.targetAudience} users! 🎉`;
        this.broadcastForm.reset({ targetAudience: 'ALL' });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to send broadcast. Please try again.';
        console.error('Broadcast error:', err);
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  getCharCount(field: string): number {
    const value = this.broadcastForm.get(field)?.value || '';
    return value.length;
  }
}