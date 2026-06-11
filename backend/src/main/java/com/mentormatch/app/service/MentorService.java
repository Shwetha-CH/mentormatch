package com.mentormatch.app.service;

import com.mentormatch.app.dto.MentorProfileRequest;
import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.MentorRepository;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Service
public class MentorService {

    private final MentorRepository mentorRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    // Dependency Injection via constructor
    public MentorService(MentorRepository mentorRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.mentorRepository = mentorRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    // Corresponds to GET /api/mentors (public + filters)
    public List<MentorProfile> getMentors(String industry, Double minRating, String skill) {
        return mentorRepository.findAvailableMentorsWithFilters(industry, minRating, skill);
    }

    // Corresponds to GET /api/mentors/{id}
    public MentorProfile getMentorById(Long id) {
        return mentorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found with ID: " + id));
    }

    // Corresponds to GET /api/mentors/recommended
    public List<MentorProfile> getRecommendedMentors() {
        return mentorRepository.findTop5ByIsAvailableTrueOrderByRatingDesc();
    }

    // Corresponds to GET /api/mentors/me
    public MentorProfile getMyProfile(String email) {
        User user = getUserByEmail(email);
        return mentorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Mentor profile has not been set up yet."));
    }

    // Corresponds to PUT /api/mentors/me
    @Transactional
    public MentorProfile updateMyProfile(String email, MentorProfileRequest request) {
        User user = getUserByEmail(email);

        // Find existing profile, or create a new one if it doesn't exist
        MentorProfile profile = mentorRepository.findByUserId(user.getId()).orElse(new MentorProfile());

        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setIndustry(request.getIndustry());
        profile.setJobTitle(request.getJobTitle());
        profile.setCompany(request.getCompany());
        profile.setSkills(request.getSkills());

        return mentorRepository.save(profile);
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

    // NEW: Method to handle file storage and updating the profile URL
    @Transactional
    public MentorProfile uploadProfilePhoto(String email, MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        // Generate the download URL dynamically based on the current server context
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/mentors/photos/")
                .path(fileName)
                .toUriString();

        User user = getUserByEmail(email);
        MentorProfile profile = mentorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setProfilePhotoUrl(fileDownloadUri);
        return mentorRepository.save(profile);
    }

    // Helper method
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}