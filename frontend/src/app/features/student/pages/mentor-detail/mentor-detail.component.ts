// src/app/features/student/pages/mentor-detail/mentor-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MentorProfile } from '../../models/mentor.model';
import { MentorService } from '../../services/mentor.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.css']
})
export class MentorDetailComponent implements OnInit {

  mentor: MentorProfile | null = null;
  loading = true;
  errorMsg = '';

  showBookingForm = false;
  bookingForm!: FormGroup;
  booking = false;
  bookingSuccess = '';
  bookingError = '';

  planTypes = [
    { value: 'SINGLE',  label: 'Single session' },
    { value: 'WEEKLY',  label: 'Weekly recurring' },
    { value: 'MONTHLY', label: 'Monthly recurring' }
  ];

  durations = [
    { value: 60,  label: '1 hour (60 mins)' },
    { value: 120, label: '2 hours (120 mins)' }
  ];

  // Min date for date picker = today
  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private fb: FormBuilder,
      private mentorService: MentorService,
      private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMsg = 'Mentor not found.';
      this.loading = false;
      return;
    }

    this.mentorService.getMentorById(id).subscribe({
      next: (mentor) => {
        this.mentor = mentor;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Could not load mentor profile.';
        this.loading = false;
      }
    });

    this.bookingForm = this.fb.group({
      topic:            ['', [Validators.required, Validators.maxLength(200)]],
      message:          [''],
      planType:         ['SINGLE', Validators.required],
      totalOccurrences: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
      sessionDate:      ['', Validators.required],
      sessionTime:      ['', Validators.required],
      durationMinutes:  [60, Validators.required]
    });
  }

  toggleBookingForm(): void {
    this.showBookingForm = !this.showBookingForm;
    this.bookingSuccess = '';
    this.bookingError = '';
  }

  onBook(): void {
    if (this.bookingForm.invalid || !this.mentor) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.booking = true;
    this.bookingError = '';

    const { sessionDate, sessionTime } = this.bookingForm.value;
    const scheduledAt = `${sessionDate}T${sessionTime}:00`;

    this.sessionService.bookSession({
      mentorId:         this.mentor.id,
      topic:            this.bookingForm.value.topic,
      message:          this.bookingForm.value.message,
      planType:         this.bookingForm.value.planType,
      totalOccurrences: this.bookingForm.value.totalOccurrences,
      scheduledAt,
      durationMinutes:  this.bookingForm.value.durationMinutes
    }).subscribe({
      next: () => {
        this.booking       = false;
        this.bookingSuccess = `Session request sent for ${sessionDate} at ${sessionTime}! The mentor will respond soon.`;
        this.showBookingForm = false;
        this.bookingForm.reset({ planType: 'SINGLE', totalOccurrences: 1, durationMinutes: 60 });
      },
      error: (err) => {
        this.booking      = false;
        this.bookingError = err.error?.message || 'Failed to book session. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/mentors']);
  }

  get initials(): string {
    return (this.mentor?.user.fullName ?? 'M')
        .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  getRatingStars(rating: number): string {
    const full = Math.max(0, Math.min(5, Math.floor(rating || 0)));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}