package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.ReviewRequest;
import com.mentormatch.app.dto.ReviewResponse;
import com.mentormatch.app.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // POST /api/reviews/sessions/{sessionId}
    // Student OR mentor submits a review after session is COMPLETED
    @PostMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @PathVariable Long sessionId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ReviewResponse review = reviewService.submitReview(sessionId, request, email);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully.", review));
    }

    // GET /api/reviews/mentors/{mentorId} — public
    @GetMapping("/mentors/{mentorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMentorReviews(
            @PathVariable Long mentorId) {

        List<ReviewResponse> reviews = reviewService.getMentorReviews(mentorId);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched.", reviews));
    }

    // GET /api/reviews/sessions/{sessionId}
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getSessionReviews(
            @PathVariable Long sessionId) {

        List<ReviewResponse> reviews = reviewService.getSessionReviews(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session reviews fetched.", reviews));
    }
}