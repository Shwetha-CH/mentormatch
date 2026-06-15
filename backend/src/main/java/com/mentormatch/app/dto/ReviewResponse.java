package com.mentormatch.app.dto;

import com.mentormatch.app.entity.Review.ReviewerRole;
import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private Long sessionId;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerPhotoUrl;
    private Integer rating;
    private String comment;
    private ReviewerRole reviewerRole;
    private LocalDateTime createdAt;

    public ReviewResponse() {}

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerPhotoUrl() { return reviewerPhotoUrl; }
    public void setReviewerPhotoUrl(String reviewerPhotoUrl) { this.reviewerPhotoUrl = reviewerPhotoUrl; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public ReviewerRole getReviewerRole() { return reviewerRole; }
    public void setReviewerRole(ReviewerRole reviewerRole) { this.reviewerRole = reviewerRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}