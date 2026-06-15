package com.mentormatch.app.dto;

import java.time.LocalDateTime;

public class AdminUserDetailResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Double rating;

    public AdminUserDetailResponse(Long id, String fullName, String email,
                                   String role, Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Double getRating() { return rating; }  // ✅ ADD THIS
    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setRating(Double rating) { this.rating = rating; }
}