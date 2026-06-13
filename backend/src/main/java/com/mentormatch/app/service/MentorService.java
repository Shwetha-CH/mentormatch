package com.mentormatch.app.service;

import com.mentormatch.app.dto.MentorProfileRequest;
import com.mentormatch.app.dto.MentorProfileResponse;
import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.MentorRepository;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MentorService {

    private final MentorRepository mentorRepository;
    private final UserRepository userRepository;

    // Dependency Injection via constructor
    public MentorService(MentorRepository mentorRepository, UserRepository userRepository) {
        this.mentorRepository = mentorRepository;
        this.userRepository = userRepository;
    }

    // Corresponds to GET /api/mentors (public + filters)
    public List<MentorProfileResponse> getMentors(String industry, Double minRating, String skill) {
        return mentorRepository.findAvailableMentorsWithFilters(industry, minRating, skill)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Corresponds to GET /api/mentors/{id}
    public MentorProfileResponse getMentorById(Long id) {
        MentorProfile profile = mentorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found with ID: " + id));
        return mapToResponse(profile);
    }

    // Corresponds to GET /api/mentors/recommended
    public List<MentorProfileResponse> getRecommendedMentors() {
        return mentorRepository.findTop5ByIsAvailableTrueOrderByRatingDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Corresponds to GET /api/mentors/me
    public MentorProfileResponse getMyProfile(String email) {
        User user = getUserByEmail(email);
        MentorProfile profile = mentorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Mentor profile has not been set up yet."));
        return mapToResponse(profile);
    }

    // Corresponds to PUT /api/mentors/me
    @Transactional
    public MentorProfileResponse updateMyProfile(String email, MentorProfileRequest request) {
        User user = getUserByEmail(email);

        // Find existing profile, or create a new one if it doesn't exist
        MentorProfile profile = mentorRepository.findByUserId(user.getId()).orElse(new MentorProfile());

        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setIndustry(request.getIndustry());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setSkills(request.getSkills());

        return mapToResponse(mentorRepository.save(profile));
    }

    // Corresponds to PATCH /api/mentors/me/availability
    @Transactional
    public void updateAvailability(String email, boolean isAvailable) {
        User user = getUserByEmail(email);
        MentorProfile profile = mentorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setIsAvailable(isAvailable);
        mentorRepository.save(profile);
    }

    // Corresponds to DELETE /api/mentors/me
    @Transactional
    public void deleteMyProfile(String email) {
        User user = getUserByEmail(email);
        MentorProfile profile = mentorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        mentorRepository.delete(profile);
    }

    // Helper method
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private MentorProfileResponse mapToResponse(MentorProfile profile) {
        User user = profile.getUser();
        MentorProfileResponse.UserSummary userSummary =
                new MentorProfileResponse.UserSummary(user.getId(), user.getFullName(), user.getEmail());

        return new MentorProfileResponse(
                profile.getId(),
                userSummary,
                profile.getBio(),
                profile.getIndustry(),
                profile.getHourlyRate(),
                profile.getSkills(),
                profile.getIsAvailable(),
                profile.getRating()
        );
    }
}
