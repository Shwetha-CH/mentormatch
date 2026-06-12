package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.MentorProfileRequest;
import com.mentormatch.app.dto.MentorProfileResponse;
import com.mentormatch.app.service.MentorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    // GET /api/mentors (public + filters)
    @GetMapping
    public ResponseEntity<ApiResponse<List<MentorProfileResponse>>> getMentors(
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String skill) {

        List<MentorProfileResponse> mentors = mentorService.getMentors(industry, minRating, skill);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mentors retrieved successfully", mentors));
    }

    // GET /api/mentors/recommended
    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<MentorProfileResponse>>> getRecommendedMentors() {
        List<MentorProfileResponse> recommended = mentorService.getRecommendedMentors();
        return ResponseEntity.ok(new ApiResponse<>(true, "Recommended mentors retrieved", recommended));
    }

    // GET /api/mentors/me
    // Only users with the MENTOR role can access their profile
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MentorProfileResponse>> getMyProfile(Authentication authentication) {
        // The authenticated user's email is stored in authentication.getName() via the
        // JWT filter
        String email = authentication.getName();
        MentorProfileResponse profile = mentorService.getMyProfile(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "My profile retrieved", profile));
    }

    // PUT /api/mentors/me
    @PreAuthorize("hasRole('MENTOR')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<MentorProfileResponse>> updateMyProfile(
            Authentication authentication,
            @RequestBody MentorProfileRequest request) {

        String email = authentication.getName();
        MentorProfileResponse updatedProfile = mentorService.updateMyProfile(email, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedProfile));
    }

    // PATCH /api/mentors/me/availability
    @PreAuthorize("hasRole('MENTOR')")
    @PatchMapping("/me/availability")
    public ResponseEntity<ApiResponse<Void>> updateAvailability(
            Authentication authentication,
            @RequestParam boolean isAvailable) {

        String email = authentication.getName();
        mentorService.updateAvailability(email, isAvailable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Availability updated", null));
    }

    // GET /api/mentors/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MentorProfileResponse>> getMentorById(@PathVariable Long id) {
        MentorProfileResponse profile = mentorService.getMentorById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mentor found", profile));
    }
}
