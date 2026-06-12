import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MentorProfile } from '../../models/mentor.model';
import { MentorService } from '../../services/mentor.service';

@Component({
  selector: 'app-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.css']
})
export class MentorDetailComponent implements OnInit {

  mentor: MentorProfile | null = null;
  loading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mentorService: MentorService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMsg = 'Mentor profile was not found.';
      this.loading = false;
      return;
    }

    this.mentorService.getMentorById(id).subscribe({
      next: (mentor) => {
        this.mentor = mentor;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Could not load this mentor profile.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/mentors']);
  }

  get initials(): string {
    return (this.mentor?.user.fullName ?? 'M')
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getRatingStars(rating: number): string {
    const full = Math.max(0, Math.min(5, Math.floor(rating || 0)));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
