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
        .subscribe(() => this.applyFilters());
  }

  loadMentors(): void {
    this.loading = true;
    this.mentorService.getMentors().subscribe({
      next: (mentors) => {
        this.allMentors = mentors;
        this.filteredMentors = mentors;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load mentors. Please try again.';
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
    const { skill, industry, minRating, available } = this.filterForm.value;

    this.filteredMentors = this.allMentors.filter(m => {
      const matchSkill    = !skill     || m.skills?.some(s =>
          s.toLowerCase().includes(skill.toLowerCase()));
      const matchIndustry = !industry  || m.industry === industry;
      const matchRating   = !minRating || (m.rating ?? 0) >= minRating;
      const matchAvail    = !available || m.isAvailable === true;
      return matchSkill && matchIndustry && matchRating && matchAvail;
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ skill: '', industry: '', minRating: 0, available: false });
    this.filteredMentors = this.allMentors;
  }

  viewMentor(id: number): void {
    this.router.navigate(['/student/mentors', id]);
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