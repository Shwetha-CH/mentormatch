import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MentorService } from '../../services/mentor.service';
import { MentorProfile } from '../../models/mentor.model';

@Component({
  selector: 'app-browse-mentors',
  templateUrl: './browse-mentors.component.html',
  styleUrls: ['./browse-mentors.component.css']
})
export class BrowseMentorsComponent implements OnInit {

  allMentors: MentorProfile[] = [];
  filteredMentors: MentorProfile[] = [];
  recommended: MentorProfile[] = [];

  filterForm!: FormGroup;
  loading = true;
  errorMsg = '';

  industries = ['FinTech', 'Healthcare', 'Software / IT', 'E-commerce', 'EdTech', 'Gaming'];
  ratings    = [
    { label: '4★ & above', value: 4 },
    { label: '3★ & above rating', value: 3 },
    { label: 'Any rating',  value: 0 }
  ];

  constructor(
      private mentorService: MentorService,
      private fb: FormBuilder,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      skill:     [''],
      industry:  [''],
      minRating: [0],
      available: [false]
    });

    this.loadMentors();
    this.loadRecommended();

    // re-filter on any form value change
    this.filterForm.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.loadMentors());
  }

  loadMentors(): void {
    this.loading = true;
    this.errorMsg = '';
    const { skill, industry, minRating } = this.filterForm.value;

    this.mentorService.getMentors({
      skill: skill || undefined,
      industry: industry || undefined,
      minRating: minRating > 0 ? minRating : undefined
    }).subscribe({
      next: (mentors) => {
        this.allMentors = mentors;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.status === 404
            ? 'Mentor API was not found on localhost:8081. Start or restart the backend, then refresh.'
            : 'Failed to load mentors. Please try again.';
        this.loading = false;
      }
    });
  }

  loadRecommended(): void {
    this.mentorService.getRecommended().subscribe({
      next: (mentors) => (this.recommended = mentors.slice(0, 3)),
      error: () => {} // recommended is non-critical, fail silently
    });
  }

  applyFilters(): void {
    const { available } = this.filterForm.value;

    this.filteredMentors = this.allMentors.filter(m => {
      const matchAvail    = !available || m.isAvailable === true;
      return matchAvail;
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ skill: '', industry: '', minRating: 0, available: false });
    this.loadMentors();
  }

  viewMentor(id: number): void {
    this.router.navigate(['/student/mentors', id]);
  }
  goback():void{
    this.router.navigate(['/student/dashboard']);
  }
  getInitials(name: string): string {
    return (name ?? 'M').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  getRatingStars(rating: number): string {
    const full  = Math.floor(rating);
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  }

  get activeFilterCount(): number {
    const { skill, industry, minRating, available } = this.filterForm.value;
    return [skill, industry, minRating > 0, available].filter(Boolean).length;
  }
}
