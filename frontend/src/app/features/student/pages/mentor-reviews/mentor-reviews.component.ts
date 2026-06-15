// src/app/features/student/mentor-reviews/mentor-reviews.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ReviewResponse } from '../../models/review.model';

@Component({
    selector: 'app-mentor-reviews',
    templateUrl: './mentor-reviews.component.html',
    styleUrls: ['./mentor-reviews.component.css']
})
export class MentorReviewsComponent implements OnInit {

    @Input() mentorId!: number;

    reviews: ReviewResponse[] = [];
    avgRating = 0;
    loading = true;

    constructor(private reviewService: ReviewService) {}

    ngOnInit(): void {
        this.reviewService.getMentorReviews(this.mentorId).subscribe({
            next: (data: ReviewResponse[]) => {
                this.reviews   = data;
                this.avgRating = data.length
                    ? data.reduce((sum: number, r: ReviewResponse) => sum + r.rating, 0) / data.length
                    : 0;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    getStars(rating: number): string {
        const full  = Math.round(rating);
        const empty = 5 - full;
        return '★'.repeat(full) + '☆'.repeat(empty);
    }

    getInitials(name: string): string {
        return (name ?? 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }
}