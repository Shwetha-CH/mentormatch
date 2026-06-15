package com.mentormatch.app.service;

import com.mentormatch.app.dto.AdminSessionResponse;
import com.mentormatch.app.dto.AdminUserDetailResponse;
import com.mentormatch.app.dto.BroadcastRequest;
import com.mentormatch.app.entity.*;
import com.mentormatch.app.entity.Session.SessionStatus;
import com.mentormatch.app.repository.MentorRepository;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.mentormatch.app.repository.SessionRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    private final MentorRepository mentorRepository;  // ✅ ADD THIS

    // ✅ UPDATE CONSTRUCTOR
    public AdminService(UserRepository userRepository,
                        SessionRepository sessionRepository,
                        MentorRepository mentorRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.mentorRepository = mentorRepository;  // ✅ ADD THIS
    }
    // 1. Get all users — for user management table
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Get users filtered by role — STUDENT or MENTOR
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    // 3. Activate or deactivate a user account
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsActive(!user.getIsActive());

        return userRepository.save(user);
    }

    // 4. Hard delete a user account
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    // 5. Broadcast — temporarily disabled until NotificationService is implemented
    // TODO: uncomment when notification team member completes NotificationService
    //
    // public void broadcast(BroadcastRequest request) {
    //     List<User> targets;
    //     if (request.getTargetAudience() == BroadcastRequest.TargetAudience.STUDENT) {
    //         targets = userRepository.findByRole(Role.STUDENT);
    //     } else if (request.getTargetAudience() == BroadcastRequest.TargetAudience.MENTOR) {
    //         targets = userRepository.findByRole(Role.MENTOR);
    //     } else {
    //         targets = userRepository.findAll();
    //     }
    //     for (User user : targets) {
    //         notificationService.createNotification(user, request.getTitle(), request.getMessage());
    //     }
    // }

    // 6. Get platform-wide stats for dashboard
    public AdminStats getPlatformStats() {
        AdminStats stats = new AdminStats();
        stats.totalUsers = userRepository.count();
        stats.totalMentors = userRepository.countByRole(Role.MENTOR);
        stats.totalStudents = userRepository.countByRole(Role.STUDENT);
        stats.totalSessions = sessionRepository.count();

        // NOW YOU CAN ADD THESE TWO COUNTS
        stats.completedSessions = sessionRepository.countByStatus(SessionStatus.COMPLETED);
        stats.pendingSessions = sessionRepository.countByStatus(SessionStatus.PENDING);

        return stats;
    }

    public AdminUserDetailResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return new AdminUserDetailResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }
    // 7. Change user role
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setRole(newRole);
        return userRepository.save(user);
    }

    // ── Inner class to carry dashboard stats ─────────────────

    public static class AdminStats {
        private long totalUsers;
        private long totalMentors;
        private long totalStudents;
        private long totalSessions;
        private long completedSessions;
        private long pendingSessions;

        // Default constructor (needed for setter-based population)
        public AdminStats() {}

        // Full constructor (optional - if you want to use it)
        public AdminStats(long totalUsers, long totalMentors, long totalStudents,
                          long totalSessions, long completedSessions, long pendingSessions) {
            this.totalUsers = totalUsers;
            this.totalMentors = totalMentors;
            this.totalStudents = totalStudents;
            this.totalSessions = totalSessions;
            this.completedSessions = completedSessions;
            this.pendingSessions = pendingSessions;
        }

        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getTotalMentors() { return totalMentors; }
        public long getTotalStudents() { return totalStudents; }
        public long getTotalSessions() { return totalSessions; }
        public long getCompletedSessions() { return completedSessions; }
        public long getPendingSessions() { return pendingSessions; }

        // Setters (needed since we're using stats.totalUsers = ... in the service)
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public void setTotalMentors(long totalMentors) { this.totalMentors = totalMentors; }
        public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
        public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }
        public void setCompletedSessions(long completedSessions) { this.completedSessions = completedSessions; }
        public void setPendingSessions(long pendingSessions) { this.pendingSessions = pendingSessions; }
    }


    public List<AdminSessionResponse> getAllSessions() {
        return sessionRepository.findAllSessionsWithOccurrences()
                .stream()
                .map(this::mapToAdminSessionResponse)
                .toList();
    }

    // Get sessions filtered by status
    public List<AdminSessionResponse> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::mapToAdminSessionResponse)
                .toList();
    }

    // Get individual session detail
    public AdminSessionResponse getSessionById(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return mapToAdminSessionResponse(session);
    }

    // Helper method to map Session entity to AdminSessionResponse
    private AdminSessionResponse mapToAdminSessionResponse(Session session) {
        AdminSessionResponse response = new AdminSessionResponse();
        response.setSessionId(session.getId());
        response.setMentorName(session.getMentor().getFullName());
        response.setMentorEmail(session.getMentor().getEmail());
        response.setStudentName(session.getStudent().getFullName());
        response.setStudentEmail(session.getStudent().getEmail());
        response.setTopic(session.getTopic());
        response.setPlanType(session.getPlanType().name());
        response.setStatus(session.getStatus().name());
        response.setTotalOccurrences(session.getTotalOccurrences());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        response.setCreatedAt(session.getCreatedAt().format(formatter));

        List<AdminSessionResponse.OccurrenceDetail> occurrences = session.getOccurrences()
                .stream()
                .map(o -> new AdminSessionResponse.OccurrenceDetail(
                        o.getId(),
                        o.getScheduledAt().format(formatter),
                        o.getDurationMinutes(),
                        o.getMeetingLink(),
                        o.getStatus().name()
                ))
                .toList();

        response.setOccurrences(occurrences);
        return response;
    }

    // Get top 5 mentors by rating
    public List<AdminUserDetailResponse> getTop5MentorsByRating() {
        List<MentorProfile> topMentors = mentorRepository.findTop5ByIsAvailableTrueOrderByRatingDesc();

        return topMentors.stream()
                .map(mentorProfile -> {
                    User user = mentorProfile.getUser();

                    AdminUserDetailResponse response = new AdminUserDetailResponse(
                            user.getId(),
                            user.getFullName(),
                            user.getEmail(),
                            user.getRole().name(),
                            user.getIsActive(),
                            user.getCreatedAt()
                    );

                    // Add rating field
                    response.setRating(mentorProfile.getRating());

                    return response;
                })
                .collect(Collectors.toList());
    }

    // Get last 5 sessions
    public List<AdminSessionResponse> getRecentSessions() {
        List<Session> sessions = sessionRepository.findTop5ByOrderByCreatedAtDesc();

        return sessions.stream()
                .limit(5)  // Ensure only 5
                .map(this::mapToAdminSessionResponse)
                .collect(Collectors.toList());
    }




}