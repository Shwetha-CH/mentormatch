import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MentorProfile } from './models/mentor-profile.model';
import { MentorProfileService } from './services/mentor-profile.service';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {

  form!: FormGroup;
  profile: MentorProfile | null = null;
  skillTags: string[] = [];
  skillInputValue = '';

  loading = true;
  saving = false;
  availabilitySaving = false;
  saveSuccess = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      industry: ['', [Validators.required, Validators.maxLength(100)]],
      bio: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMsg = '';

    this.mentorService.getMyProfile().subscribe({
      next: (profile) => {
        this.applyProfile(profile);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.profile = null;
        this.errorMsg = 'Complete your mentor profile to start appearing in student search.';
      }
    });
  }

  applyProfile(profile: MentorProfile): void {
    this.profile = profile;
    this.skillTags = profile.skills ?? [];
    this.form.patchValue({
      industry: profile.industry ?? '',
      bio: profile.bio ?? ''
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.saveSuccess = false;
    this.errorMsg = '';

    this.mentorService.updateMyProfile({
      industry: this.form.value.industry,
      bio: this.form.value.bio,
      skills: this.skillTags
    }).subscribe({
      next: (profile) => {
        this.applyProfile(profile);
        this.saving = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => {
        this.errorMsg = 'Profile save failed. Please try again.';
        this.saving = false;
      }
    });
  }

  toggleAvailability(): void {
    if (!this.profile || this.availabilitySaving) {
      return;
    }

    const nextValue = !this.profile.isAvailable;
    this.availabilitySaving = true;
    this.errorMsg = '';

    this.mentorService.updateAvailability(nextValue).subscribe({
      next: () => {
        this.profile = { ...this.profile!, isAvailable: nextValue };
        this.availabilitySaving = false;
      },
      error: () => {
        this.errorMsg = 'Availability update failed. Save your profile first, then try again.';
        this.availabilitySaving = false;
      }
    });
  }

  onSkillKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.commitSkill();
    }

    if (event.key === 'Backspace' && !this.skillInputValue && this.skillTags.length) {
      this.skillTags.pop();
    }
  }

  commitSkill(): void {
    const value = this.skillInputValue.trim().replace(/,+$/, '');
    if (value && !this.skillTags.includes(value)) {
      this.skillTags.push(value);
    }
    this.skillInputValue = '';
  }

  removeSkill(skill: string): void {
    this.skillTags = this.skillTags.filter(item => item !== skill);
  }

  get initials(): string {
    return this.displayName
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  get displayName(): string {
    return this.profile?.user?.fullName || this.authService.getFullName() || 'Mentor';
  }

  get email(): string {
    return this.profile?.user?.email || this.authService.getUserData()?.email || '';
  }

  get bioLength(): number {
    return (this.form.get('bio')?.value ?? '').length;
  }

  get profileCompletion(): number {
    const fields = [
      this.form.get('industry')?.value,
      this.form.get('bio')?.value,
      this.skillTags.length > 0
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }
}
