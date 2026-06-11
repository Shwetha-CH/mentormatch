package com.mentormatch.app.service;

import com.mentormatch.app.dto.BroadcastRequest;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.entity.Role;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        long totalUsers   = userRepository.count();
        long totalMentors = userRepository.countByRole(Role.MENTOR);
        long totalStudents = userRepository.countByRole(Role.STUDENT);

        return new AdminStats(totalUsers, totalMentors, totalStudents);
    }

    // ── Inner class to carry dashboard stats ─────────────────

    public static class AdminStats {
        private long totalUsers;
        private long totalMentors;
        private long totalStudents;

        public AdminStats(long totalUsers, long totalMentors, long totalStudents) {
            this.totalUsers = totalUsers;
            this.totalMentors = totalMentors;
            this.totalStudents = totalStudents;
        }

        public long getTotalUsers() { return totalUsers; }
        public long getTotalMentors() { return totalMentors; }
        public long getTotalStudents() { return totalStudents; }
    }
}