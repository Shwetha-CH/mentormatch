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
  searchQuery: string = '';

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
        this.applyFilters();
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
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.reviews;

    // Filter by rating
    if (this.selectedRating !== 'ALL') {
      const rating = parseInt(this.selectedRating);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.reviewerName.toLowerCase().includes(query) ||
        review.revieweeName.toLowerCase().includes(query) ||
        review.reviewerEmail.toLowerCase().includes(query) ||
        review.revieweeEmail.toLowerCase().includes(query) ||
        (review.comment && review.comment.toLowerCase().includes(query))
      );
    }

    this.filteredReviews = filtered;
  }

  deleteReview(review: AdminReview): void {
    if (!confirm(`Are you sure you want to delete this review by ${review.reviewerName}?`)) {
      return;
    }

    this.adminService.deleteReview(review.id).subscribe({
      next: () => {
        // Remove from local array
        this.reviews = this.reviews.filter(r => r.id !== review.id);
        this.applyFilters();
        alert('Review deleted successfully! ✅');
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        alert('Failed to delete review. Please try again.');
      }
    });
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