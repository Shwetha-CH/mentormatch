package com.mentormatch.app.controller;

import com.mentormatch.app.dto.AdminUpdateRoleRequest;
import com.mentormatch.app.dto.AdminUserDetailResponse;
import com.mentormatch.app.entity.Role;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mentormatch.app.dto.AdminSessionResponse;
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
}