package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.MentorProfileRequest;
import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.service.MentorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<ApiResponse<List<MentorProfile>>> getMentors(
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String skill) {

        List<MentorProfile> mentors = mentorService.getMentors(industry, minRating, skill);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mentors retrieved successfully", mentors));
    }

    // GET /api/mentors/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MentorProfile>> getMentorById(@PathVariable Long id) {
        MentorProfile profile = mentorService.getMentorById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mentor found", profile));
    }

    // GET /api/mentors/recommended
    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<MentorProfile>>> getRecommendedMentors() {
        List<MentorProfile> recommended = mentorService.getRecommendedMentors();
        return ResponseEntity.ok(new ApiResponse<>(true, "Recommended mentors retrieved", recommended));
    }

    // GET /api/mentors/me
    // Only users with the MENTOR role can access their profile
    @PreAuthorize("hasAuthority('MENTOR')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MentorProfile>> getMyProfile(Authentication authentication) {
        // The authenticated user's email is stored in authentication.getName() via the
        // JWT filter
        String email = authentication.getName();
        MentorProfile profile = mentorService.getMyProfile(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "My profile retrieved", profile));
    }

    // PUT /api/mentors/me
    @PreAuthorize("hasAuthority('MENTOR')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<MentorProfile>> updateMyProfile(
            Authentication authentication,
            @RequestBody MentorProfileRequest request) {

        String email = authentication.getName();
        MentorProfile updatedProfile = mentorService.updateMyProfile(email, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedProfile));
    }

    // PATCH /api/mentors/me/availability
    @PreAuthorize("hasAuthority('MENTOR')")
    @PatchMapping("/me/availability")
    public ResponseEntity<ApiResponse<Void>> updateAvailability(
            Authentication authentication,
            @RequestParam boolean isAvailable) {

        String email = authentication.getName();
        mentorService.updateAvailability(email, isAvailable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Availability updated", null));
    }

    // POST /api/mentors/me/photo
    @PreAuthorize("hasAuthority('MENTOR')")
    @PostMapping("/me/photo")
    public ResponseEntity<ApiResponse<MentorProfile>> uploadProfilePhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        String email = authentication.getName();
        MentorProfile updatedProfile = mentorService.uploadProfilePhoto(email, file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile photo uploaded successfully", updatedProfile));
    }
}
