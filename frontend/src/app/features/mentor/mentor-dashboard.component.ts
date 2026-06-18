import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { MentorProfile } from './models/mentor-profile.model';
import { MentorProfileService } from './services/mentor-profile.service';
import { SessionManagementService } from './services/session.service';
import { NotificationService } from './services/notification.service';
import { SessionResponse } from './models/session.model';
import { NotificationItem } from '../student/models/notification.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('250ms ease', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class MentorDashboardComponent implements OnInit {

  activeTab: 'sessions' | 'reviews' | 'profile' | 'notifications' = 'sessions';

  // Profile
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

  // Sessions
  sessionsList: SessionResponse[] = [];
  sessionsLoading = false;
  sessionActionRunning = false;

  // Accept modal
  showAcceptModal = false;
  selectedSessionId: number | null = null;
  inputMeetingLink = '';

  // Reason modal (Reject / Cancel)
  showCancelModal = false;
  cancelSessionId: number | null = null;
  cancelReason = '';
  cancelReasonError = false;
  modalAction: 'reject' | 'cancel' = 'reject';

  // Reviews
  reviewsList: any[] = [];
  reviewsLoading = false;

  // Notifications
  notifications: NotificationItem[] = [];
  notifLoading = false;
  unreadCount = 0;

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorProfileService,
    private authService: AuthService,
    private sessionService: SessionManagementService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      industry: ['', [Validators.required, Validators.maxLength(100)]],
      hourlyRate: [null, [Validators.min(0), Validators.max(100000)]],
      bio: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.loadProfile();
    this.loadSessionRequests();
    this.loadUnreadCount();
  }

  // ── Tab switching ──────────────────────────────────────────
  switchTab(tabName: 'sessions' | 'reviews' | 'profile' | 'notifications'): void {
    this.activeTab = tabName;
    if (tabName === 'sessions')      this.loadSessionRequests();
    if (tabName === 'reviews')       this.loadMyReviews();
    if (tabName === 'notifications') this.loadNotifications();
  }

  // ── Greeting ───────────────────────────────────────────────
  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  get firstName(): string {
    return this.displayName.split(' ')[0];
  }

  // ── Stats ──────────────────────────────────────────────────
  get pendingCount(): number   { return this.sessionsList.filter(s => s.status === 'PENDING').length; }
  get acceptedCount(): number  { return this.sessionsList.filter(s => s.status === 'ACCEPTED').length; }
  get completedCount(): number { return this.sessionsList.filter(s => s.status === 'COMPLETED').length; }

  getStatusClass(status: string): string {
    const m: Record<string, string> = {
      ACCEPTED: 'accepted', COMPLETED: 'completed',
      REJECTED: 'rejected', CANCELLED: 'cancelled'
    };
    return m[status] ?? '';
  }

  // ── Sessions ───────────────────────────────────────────────
  loadSessionRequests(): void {
    this.sessionsLoading = true;
    this.errorMsg = '';
    this.sessionService.getMySessions().subscribe({
      next: (res) => { this.sessionsList = res.data || []; this.sessionsLoading = false; },
      error: () => { this.errorMsg = 'Failed to load sessions.'; this.sessionsLoading = false; }
    });
  }

  // Accept modal
  openAcceptWindow(id: number): void {
    this.selectedSessionId = id;
    this.inputMeetingLink = '';
    this.showAcceptModal = true;
  }
  closeAcceptWindow(): void { this.showAcceptModal = false; this.selectedSessionId = null; }
  confirmAcceptance(): void {
    if (!this.inputMeetingLink.trim() || !this.selectedSessionId) return;
    this.sessionActionRunning = true;
    this.sessionService.acceptSession(this.selectedSessionId, this.inputMeetingLink.trim()).subscribe({
      next: () => { this.sessionActionRunning = false; this.closeAcceptWindow(); this.loadSessionRequests(); },
      error: () => { this.sessionActionRunning = false; alert('Could not accept session.'); }
    });
  }

  // Reason modal
  openReasonModal(id: number, action: 'reject' | 'cancel'): void {
    this.cancelSessionId = id;
    this.modalAction = action;
    this.cancelReason = '';
    this.cancelReasonError = false;
    this.showCancelModal = true;
  }
  closeCancelModal(): void { this.showCancelModal = false; this.cancelSessionId = null; this.cancelReason = ''; }
  confirmCancellation(): void {
    if (!this.cancelReason.trim()) { this.cancelReasonError = true; return; }
    if (!this.cancelSessionId) return;
    this.sessionActionRunning = true;
    const obs = this.modalAction === 'reject'
      ? this.sessionService.rejectSession(this.cancelSessionId, this.cancelReason.trim())
      : this.sessionService.cancelSession(this.cancelSessionId, this.cancelReason.trim());
    obs.subscribe({
      next: () => { this.sessionActionRunning = false; this.closeCancelModal(); this.loadSessionRequests(); },
      error: () => { this.sessionActionRunning = false; alert('Could not complete action. Please try again.'); }
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

  // ── Reviews ────────────────────────────────────────────────
  loadMyReviews(): void {
    this.reviewsLoading = true;
    this.http.get<any>(`${environment.apiUrl}/api/reviews/mentor/me`).subscribe({
      next: (res) => { this.reviewsList = res.data || []; this.reviewsLoading = false; },
      error: () => { this.reviewsLoading = false; }
    });
  }

  getAvgRating(): string {
    if (!this.reviewsList.length) return '0.0';
    const avg = this.reviewsList.reduce((s: number, r: any) => s + r.rating, 0) / this.reviewsList.length;
    return avg.toFixed(1);
  }
  getAvgRatingNum(): number { return Math.round(parseFloat(this.getAvgRating())); }
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

  // ── Notifications ──────────────────────────────────────────
  loadNotifications(): void {
    this.notifLoading = true;
    this.notificationService.loadAll().subscribe({
      next: (data) => { this.notifications = data; this.notifLoading = false; this.updateUnread(); },
      error: () => { this.notifLoading = false; }
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => { this.unreadCount = count; },
      error: () => {}
    });
  }

  updateUnread(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
        this.unreadCount = 0;
      }
    });
  }

  markOneRead(n: NotificationItem): void {
    if (n.isRead) return;
    this.notificationService.markOneAsRead(n.id).subscribe({
      next: () => {
        n.isRead = true;
        this.updateUnread();
      }
    });
  }

  formatNotifDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60)   return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  // ── Profile ────────────────────────────────────────────────
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
  cancelDeleteProfile(): void  { this.confirmDelete = false; }

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

  logout(): void { this.authService.logout(); }
  private resetForm(): void { this.form.reset({ industry: '', hourlyRate: null, bio: '' }); }
}