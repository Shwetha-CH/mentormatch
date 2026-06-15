package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.NotificationResponse;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.UserRepository;
import com.mentormatch.app.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                  UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // GET /api/notifications
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getAll(Authentication authentication) {
        Long userId = getUserId(authentication);
        List<NotificationResponse> list = notificationService.getAll(userId);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched.", list));
    }

    // GET /api/notifications/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication authentication) {
        Long userId = getUserId(authentication);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched.", count));
    }

    // PATCH /api/notifications/read-all
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication authentication) {
        Long userId = getUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All marked as read.", null));
    }

    // PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markOneAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        notificationService.markOneAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Marked as read.", null));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}