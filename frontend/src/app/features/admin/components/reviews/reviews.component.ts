// src/app/features/admin/components/reviews/reviews.component.ts

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminReview } from '../../models/admin-review.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  
  reviews: AdminReview[] = [];
  filteredReviews: AdminReview[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedRating: string = 'ALL';

  ratingOptions = [
    { value: 'ALL', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.filteredReviews = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reviews. Please try again.';
        this.loading = false;
        console.error('Error loading reviews:', err);
      }
    });
  }

  onFilterChange(): void {
    if (this.selectedRating === 'ALL') {
      this.filteredReviews = this.reviews;
    } else {
      const rating = parseInt(this.selectedRating);
      this.filteredReviews = this.reviews.filter(review => review.rating === rating);
    }
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? '★' : '☆');
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) return 'rating-high';
    if (rating >= 3) return 'rating-medium';
    return 'rating-low';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}