package com.mentormatch.app.dto;

import com.mentormatch.app.entity.SupportTicket.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SupportReplyRequest {

    @NotBlank(message = "Reply message is required")
    private String adminReply;

    // Admin updates the status when replying — IN_PROGRESS or RESOLVED
    @NotNull(message = "Status is required")
    private TicketStatus status;

    // ── Constructors ──────────────────────────────────────────

    public SupportReplyRequest() {}

    public SupportReplyRequest(String adminReply, TicketStatus status) {
        this.adminReply = adminReply;
        this.status = status;
    }

    // ── Getters & Setters ─────────────────────────────────────

    public String getAdminReply() { return adminReply; }
    public void setAdminReply(String adminReply) { this.adminReply = adminReply; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
}