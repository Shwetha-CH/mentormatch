import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { StudentProfile } from '../../models/student-profile.model';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  form!: FormGroup;
  profile!: StudentProfile;

  interestTags: string[] = [];
  tagInputValue = '';

  loading = true;
  saving = false;
  saveSuccess = false;
  errorMsg = '';

  constructor(
      private fb: FormBuilder,
      private studentService: StudentService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      headline:    ['', [Validators.required, Validators.maxLength(255)]],
      currentRole: ['', [Validators.required, Validators.maxLength(100)]],
      goals:       ['', Validators.maxLength(500)]
    });

    this.studentService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.interestTags = p.interests
            ? p.interests.split(',').map(t => t.trim()).filter(Boolean)
            : [];
        this.form.patchValue({
          headline:    p.headline    ?? '',
          currentRole: p.currentRole ?? '',
          goals:       p.goals       ?? ''
        });
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Could not load profile. Please refresh.';
        this.loading = false;
      }
    });
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.commitTag();
    }
    if (event.key === 'Backspace' && !this.tagInputValue && this.interestTags.length) {
      this.interestTags.pop();
    }
  }

  commitTag(): void {
    const val = this.tagInputValue.trim().replace(/,+$/, '');
    if (val && !this.interestTags.includes(val)) {
      this.interestTags.push(val);
    }
    this.tagInputValue = '';
  }

  removeTag(tag: string): void {
    this.interestTags = this.interestTags.filter(t => t !== tag);
  }

  get goalsLength(): number {
    return (this.form.get('goals')?.value ?? '').length;
  }

  get initials(): string {
    return (this.profile?.fullName ?? 'U')
        .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saveSuccess = false;
    this.errorMsg = '';

    this.studentService.updateProfile({
      headline:    this.form.value.headline,
      currentRole: this.form.value.currentRole,
      goals:       this.form.value.goals,
      interests:   this.interestTags.join(',')
    }).subscribe({
      next: (p) => {
        this.profile = p;
        this.saving = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => {
        this.errorMsg = 'Save failed. Please try again.';
        this.saving = false;
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/student/dashboard']);
  }
}