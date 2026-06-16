package com.mentormatch.app.controller;

import com.mentormatch.app.dto.*;
import com.mentormatch.app.entity.Role;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mentormatch.app.entity.Session.SessionStatus;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ── User Management ───────────────────────────────────────

    // GET /api/admin/users — get all users, optional filter by role
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) Role role) {

        if (role != null) {
            return ResponseEntity.ok(adminService.getUsersByRole(role));
        }
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // PATCH /api/admin/users/{id}/toggle — activate or deactivate user
    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    // DELETE /api/admin/users/{id} — hard delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ── Dashboard Stats ───────────────────────────────────────

    // GET /api/admin/stats — platform wide statistics
    @GetMapping("/stats")
    public ResponseEntity<AdminService.AdminStats> getPlatformStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    // ── Broadcast ─────────────────────────────────────────────

    // POST /api/admin/notifications/broadcast
    // TODO: uncomment when NotificationService is implemented
    //
    // @PostMapping("/notifications/broadcast")
    // public ResponseEntity<String> broadcast(@Valid @RequestBody BroadcastRequest request) {
    //     adminService.broadcast(request);
    //     return ResponseEntity.ok("Broadcast sent successfully");
    // }

    // ── Individual User ───────────────────────────────────────

    // GET /api/admin/users/{id} — get single user detail
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        AdminUserDetailResponse user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // PATCH /api/admin/users/{id}/role — change user role
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateRoleRequest request) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole()));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<AdminSessionResponse>> getAllSessions(
            @RequestParam(required = false) SessionStatus status) {

        if (status != null) {
            return ResponseEntity.ok(adminService.getSessionsByStatus(status));
        }
        return ResponseEntity.ok(adminService.getAllSessions());
    }

    // GET /api/admin/sessions/{id} — get individual session detail
    @GetMapping("/sessions/{id}")
    public ResponseEntity<AdminSessionResponse> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getSessionById(id));
    }

    @GetMapping("/mentors/top5")
    public ResponseEntity<List<AdminUserDetailResponse>> getTop5Mentors() {
        return ResponseEntity.ok(adminService.getTop5MentorsByRating());
    }

    // GET /api/admin/sessions/recent
    @GetMapping("/sessions/recent")
    public ResponseEntity<List<AdminSessionResponse>> getRecentSessions() {
        return ResponseEntity.ok(adminService.getRecentSessions());
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<AdminService.AdminReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    // POST /api/admin/notifications/broadcast
    // POST /api/admin/notifications/broadcast
    @PostMapping("/notifications/broadcast")
    public ResponseEntity<ApiResponse<String>> broadcast(@Valid @RequestBody BroadcastRequest request) {
        adminService.broadcast(request);
        String message = "Broadcast sent successfully to " + request.getTargetAudience() + " users";
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));  // ✅ Return JSON
    }

    // ✅ ADD THESE ENDPOINTS TO AdminController.java

// ── REVIEW MANAGEMENT ─────────────────────────────────────

    // DELETE /api/admin/reviews/{id}
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Review deleted successfully", null));
    }

// ── SESSION MANAGEMENT ────────────────────────────────────

    // PATCH /api/admin/sessions/{id}/cancel
    @PatchMapping("/sessions/{id}/cancel")
    public ResponseEntity<ApiResponse<AdminSessionResponse>> cancelSession(@PathVariable Long id) {
        AdminSessionResponse session = adminService.cancelSession(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session cancelled successfully", session));
    }

    // PATCH /api/admin/sessions/{id}/force-complete
    @PatchMapping("/sessions/{id}/force-complete")
    public ResponseEntity<ApiResponse<AdminSessionResponse>> forceCompleteSession(@PathVariable Long id) {
        AdminSessionResponse session = adminService.forceCompleteSession(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session marked as completed", session));
    }

    // DELETE /api/admin/sessions/{id}
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSession(@PathVariable Long id) {
        adminService.deleteSession(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session deleted successfully", null));
    }
}