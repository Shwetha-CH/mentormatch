package com.mentormatch.app.controller;

import com.mentormatch.app.dto.AcceptSessionRequest;
import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.SessionResponse;
import com.mentormatch.app.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // GET /api/sessions/mentor/me
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/mentor/me")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getMySessions(Authentication authentication) {
        String email = authentication.getName();
        List<SessionResponse> sessions = sessionService.getMySessions(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mentor requests retrieved successfully", sessions));
    }

    // PATCH /api/sessions/{id}/accept
    @PreAuthorize("hasRole('MENTOR')")
    @PatchMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<SessionResponse>> acceptSession(
            @PathVariable Long id,
            @RequestBody AcceptSessionRequest request) {
        SessionResponse updated = sessionService.acceptSession(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session request accepted successfully", updated));
    }

    // PATCH /api/sessions/{id}/reject
    @PreAuthorize("hasRole('MENTOR')")
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<SessionResponse>> rejectSession(@PathVariable Long id) {
        SessionResponse updated = sessionService.rejectSession(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session request rejected", updated));
    }

    // PATCH /api/sessions/occurrences/{oid}/cancel
    @PreAuthorize("hasRole('MENTOR')")
    @PatchMapping("/occurrences/{oid}/cancel")
    public ResponseEntity<ApiResponse<SessionResponse>> cancelOccurrence(@PathVariable Long oid) {
        SessionResponse updated = sessionService.cancelIndividualOccurrence(oid);
        return ResponseEntity.ok(new ApiResponse<>(true, "Specific date occurrence cancelled successfully", updated));
    }
}