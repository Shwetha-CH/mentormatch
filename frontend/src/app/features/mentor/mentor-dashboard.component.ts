import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MentorProfile } from './models/mentor-profile.model';
import { MentorProfileService } from './services/mentor-profile.service';
import { SessionManagementService } from './services/session.service';
import { SessionResponse } from './models/session.model';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {

  activeTab: 'profile' | 'sessions' | 'reviews' = 'profile';

  form!: FormGroup;
  profile: MentorProfile | null = null;
  skillTags: string[] = [];
  skillInputValue = '';
  loading = true;
  saving = false;
  availabilitySaving = false;
  deleting = false;
  confirmDelete = false;
  saveSuccess = false;
  errorMsg = '';

  sessionsList: SessionResponse[] = [];
  sessionsLoading = false;
  sessionActionRunning = false;

  showAcceptModal = false;
  selectedSessionId: number | null = null;
  inputMeetingLink = '';

  reviewsList: any[] = [];
  reviewsLoading = false;

  constructor(
      private fb: FormBuilder,
      private mentorService: MentorProfileService,
      private authService: AuthService,
      private sessionService: SessionManagementService,
      private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      industry: ['', [Validators.required, Validators.maxLength(100)]],
      hourlyRate: [null, [Validators.min(0), Validators.max(100000)]],
      bio: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.loadProfile();
  }

  switchTab(tabName: 'profile' | 'sessions' | 'reviews'): void {
    this.activeTab = tabName;
    if (tabName === 'sessions') this.loadSessionRequests();
    if (tabName === 'reviews') this.loadMyReviews();
  }

  loadSessionRequests(): void {
    this.sessionsLoading = true;
    this.errorMsg = '';
    this.sessionService.getMySessions().subscribe({
      next: (res) => { this.sessionsList = res.data || []; this.sessionsLoading = false; },
      error: () => { this.errorMsg = 'Failed to load sessions.'; this.sessionsLoading = false; }
    });
  }

  // UPDATED URL: Now maps directly to the authenticated endpoint /api/reviews/mentor/me
  loadMyReviews(): void {
    this.reviewsLoading = true;
    this.http.get<any>(`${environment.apiUrl}/api/reviews/mentor/me`).subscribe({
      next: (res) => {
        this.reviewsList = res.data || [];
        this.reviewsLoading = false;
      },
      error: () => {
        this.reviewsLoading = false;
      }
    });
  }

  openAcceptWindow(id: number): void {
    this.selectedSessionId = id;
    this.inputMeetingLink = '';
    this.showAcceptModal = true;
  }

  closeAcceptWindow(): void {
    this.showAcceptModal = false;
    this.selectedSessionId = null;
  }

  confirmAcceptance(): void {
    if (!this.inputMeetingLink.trim() || !this.selectedSessionId) return;
    this.sessionActionRunning = true;
    this.sessionService.acceptSession(this.selectedSessionId, this.inputMeetingLink.trim()).subscribe({
      next: () => { this.sessionActionRunning = false; this.closeAcceptWindow(); this.loadSessionRequests(); },
      error: () => { this.sessionActionRunning = false; alert('Could not accept session.'); }
    });
  }

  executeRejection(id: number): void {
    if (!confirm('Decline this request?')) return;
    this.sessionActionRunning = true;
    this.sessionService.rejectSession(id).subscribe({
      next: () => { this.sessionActionRunning = false; this.loadSessionRequests(); },
      error: () => { this.sessionActionRunning = false; alert('Could not reject session.'); }
    });
  }

  markAsComplete(id: number): void {
    if (!confirm('Mark this session as completed? The student will be asked to leave a review.')) return;
    this.sessionActionRunning = true;
    this.sessionService.completeSession(id).subscribe({
      next: () => { this.sessionActionRunning = false; this.loadSessionRequests(); },
      error: () => { this.sessionActionRunning = false; alert('Could not complete session.'); }
    });
  }

  executeOccurrenceCancel(occurrenceId: number): void {
    if (!confirm('Cancel this slot?')) return;
    this.sessionActionRunning = true;
    this.sessionService.cancelOccurrence(occurrenceId).subscribe({
      next: () => { this.sessionActionRunning = false; this.loadSessionRequests(); },
      error: () => { this.sessionActionRunning = false; alert('Failed to cancel slot.'); }
    });
  }

  get pendingCount(): number {
    return this.sessionsList.filter(s => s.status === 'PENDING').length;
  }

  getAvgRating(): string {
    if (!this.reviewsList.length) return '0.0';
    const avg = this.reviewsList.reduce((s: number, r: any) => s + r.rating, 0) / this.reviewsList.length;
    return avg.toFixed(1);
  }

  getAvgRatingNum(): number {
    return Math.round(parseFloat(this.getAvgRating()));
  }

  getReviewInitials(name: string): string {
    if (!name) return 'S';
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  formatReviewDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }

  // ── Profile handlers ──────────────────────────────
  loadProfile(): void {
    this.loading = true;
    this.mentorService.getMyProfile().subscribe({
      next: (profile) => { this.applyProfile(profile); this.loading = false; },
      error: () => {
        this.loading = false; this.profile = null; this.resetForm();
        this.errorMsg = 'Complete your mentor profile to appear in student search.';
      }
    });
  }

  applyProfile(profile: MentorProfile): void {
    this.profile = profile;
    this.skillTags = profile.skills ?? [];
    this.form.patchValue({ industry: profile.industry ?? '', hourlyRate: profile.hourlyRate ?? null, bio: profile.bio ?? '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.mentorService.updateMyProfile({
      industry: this.form.value.industry,
      hourlyRate: this.form.value.hourlyRate === null || this.form.value.hourlyRate === '' ? null : Number(this.form.value.hourlyRate),
      bio: this.form.value.bio,
      skills: this.skillTags
    }).subscribe({
      next: (profile) => { this.applyProfile(profile); this.saving = false; this.saveSuccess = true; setTimeout(() => (this.saveSuccess = false), 3000); },
      error: () => { this.errorMsg = 'Profile save failed.'; this.saving = false; }
    });
  }

  toggleAvailability(): void {
    if (!this.profile || this.availabilitySaving) return;
    const nextValue = !this.profile.isAvailable;
    this.availabilitySaving = true;
    this.mentorService.updateAvailability(nextValue).subscribe({
      next: () => { this.profile = { ...this.profile!, isAvailable: nextValue }; this.availabilitySaving = false; },
      error: () => { this.errorMsg = 'Availability update failed.'; this.availabilitySaving = false; }
    });
  }

  requestDeleteProfile(): void { if (!this.profile) return; this.confirmDelete = true; }
  cancelDeleteProfile(): void { this.confirmDelete = false; }

  deleteProfile(): void {
    if (!this.profile || this.deleting) return;
    this.deleting = true;
    this.mentorService.deleteMyProfile().subscribe({
      next: () => {
        this.profile = null; this.skillTags = []; this.skillInputValue = '';
        this.resetForm(); this.confirmDelete = false; this.deleting = false;
        this.saveSuccess = true; setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => { this.errorMsg = 'Profile delete failed.'; this.deleting = false; }
    });
  }

  onSkillKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); this.commitSkill(); }
    if (event.key === 'Backspace' && !this.skillInputValue && this.skillTags.length) { this.skillTags.pop(); }
  }

  commitSkill(): void {
    const value = this.skillInputValue.trim().replace(/,+$/, '');
    if (value && !this.skillTags.includes(value)) { this.skillTags.push(value); }
    this.skillInputValue = '';
  }

  removeSkill(skill: string): void { this.skillTags = this.skillTags.filter(item => item !== skill); }
  get initials(): string { return this.displayName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(); }
  get displayName(): string { return this.profile?.user?.fullName || this.authService.getFullName() || 'Mentor'; }
  get email(): string { return this.profile?.user?.email || this.authService.getUserData()?.email || ''; }
  get bioLength(): number { return (this.form.get('bio')?.value ?? '').length; }
  get profileCompletion(): number {
    const fields = [this.form.get('industry')?.value, this.form.get('hourlyRate')?.value !== null && this.form.get('hourlyRate')?.value !== '', this.form.get('bio')?.value, this.skillTags.length > 0];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }

  logout(): void { this.authService.logout(); }
  private resetForm(): void { this.form.reset({ industry: '', hourlyRate: null, bio: '' }); }
}