// src/app/features/student/pages/mentor-detail/mentor-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MentorProfile } from '../../models/mentor.model';
import { MentorService } from '../../services/mentor.service';
import { SessionService } from '../../services/session.service';
import { ReviewService } from '../../services/review.service';
import { ReviewResponse } from '../../models/review.model';

// Cross-field validator: if date is today, time must not be in the past
function futureDateTimeValidator(control: AbstractControl): ValidationErrors | null {
  const date = control.get('sessionDate')?.value;
  const time = control.get('sessionTime')?.value;
  if (!date || !time) return null;

  const selected = new Date(`${date}T${time}:00`);
  const now = new Date();
  if (selected <= now) {
    return { pastDateTime: true };
  }
  return null;
}

@Component({
  selector: 'app-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.css']
})
export class MentorDetailComponent implements OnInit {

  mentor: MentorProfile | null = null;
  loading = true;
  errorMsg = '';

  reviews: ReviewResponse[] = [];
  reviewsLoading = true;
  showAllReviews = false;

  get displayedReviews(): ReviewResponse[] {
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, 3);
  }

  get avgRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  }

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
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private fb: FormBuilder,
      private mentorService: MentorService,
      private sessionService: SessionService,
      private reviewService: ReviewService
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
        this.loadReviews(id);
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
    }, { validators: futureDateTimeValidator });
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

  loadReviews(mentorId: number): void {
    this.reviewsLoading = true;
    this.reviewService.getMentorReviews(mentorId).subscribe({
      next: (data) => {
        // Most recent first
        this.reviews = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.reviewsLoading = false;
      },
      error: () => { this.reviewsLoading = false; }
    });
  }

  getReviewStars(rating: number): string {
    const full = Math.max(0, Math.min(5, Math.floor(rating || 0)));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  getReviewerInitials(name: string): string {
    return (name ?? 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  formatReviewDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
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