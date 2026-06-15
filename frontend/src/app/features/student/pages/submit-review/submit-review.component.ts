// src/app/features/student/submit-review/submit-review.component.ts

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ReviewResponse } from '../../models/review.model';

@Component({
    selector: 'app-submit-review',
    templateUrl: './submit-review.component.html',
    styleUrls: ['./submit-review.component.css']
})
export class SubmitReviewComponent {

    @Input() sessionId!: number;
    @Output() reviewSubmitted = new EventEmitter<ReviewResponse>();

    stars = [1, 2, 3, 4, 5];
    selectedRating = 0;
    hoveredRating  = 0;
    comment        = '';

    submitting    = false;
    successMsg    = '';
    errorMsg      = '';

    constructor(private reviewService: ReviewService) {}

    setRating(star: number): void {
        this.selectedRating = star;
    }

    getStarClass(star: number): string {
        const active = this.hoveredRating || this.selectedRating;
        return star <= active ? 'star filled' : 'star empty';
    }

    onSubmit(): void {
        if (this.selectedRating === 0) {
            this.errorMsg = 'Please select a star rating.';
            return;
        }

        this.submitting = true;
        this.errorMsg   = '';

        this.reviewService.submitReview(this.sessionId, {
            rating:  this.selectedRating,
            comment: this.comment || undefined
        }).subscribe({
            next: (review: ReviewResponse) => {
                this.submitting  = false;
                this.successMsg  = 'Review submitted successfully!';
                this.reviewSubmitted.emit(review);
            },
            error: (err: any) => {
                this.submitting = false;
                this.errorMsg   = err.error?.message || 'Failed to submit review.';
            }
        });
    }
}