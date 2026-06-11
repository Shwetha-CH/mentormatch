package com.mentormatch.app.controller;

import com.mentormatch.app.dto.BroadcastRequest;
import com.mentormatch.app.dto.SupportReplyRequest;
import com.mentormatch.app.dto.SupportTicketRequest;
import com.mentormatch.app.entity.Role;
import com.mentormatch.app.entity.SupportTicket;
import com.mentormatch.app.entity.SupportTicket.TicketCategory;
import com.mentormatch.app.entity.SupportTicket.TicketStatus;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.service.AdminService;
import com.mentormatch.app.service.SupportTicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final SupportTicketService supportTicketService;

    public AdminController(AdminService adminService,
                           SupportTicketService supportTicketService) {
        this.adminService = adminService;
        this.supportTicketService = supportTicketService;
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

    // ── Support Tickets ───────────────────────────────────────

    // GET /api/admin/support — get all tickets, optional filters
    @GetMapping("/support")
    public ResponseEntity<List<SupportTicket>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketCategory category) {

        if (status != null && category != null) {
            return ResponseEntity.ok(supportTicketService.getTicketsByStatusAndCategory(status, category));
        } else if (status != null) {
            return ResponseEntity.ok(supportTicketService.getTicketsByStatus(status));
        } else if (category != null) {
            return ResponseEntity.ok(supportTicketService.getTicketsByCategory(category));
        }
        return ResponseEntity.ok(supportTicketService.getAllTickets());
    }

    // GET /api/admin/support/{id} — get single ticket
    @GetMapping("/support/{id}")
    public ResponseEntity<SupportTicket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(supportTicketService.getTicketById(id));
    }

    // PATCH /api/admin/support/{id}/reply — admin replies and updates status
    @PatchMapping("/support/{id}/reply")
    public ResponseEntity<SupportTicket> replyToTicket(
            @PathVariable Long id,
            @Valid @RequestBody SupportReplyRequest request) {
        return ResponseEntity.ok(supportTicketService.replyToTicket(id, request));
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
}