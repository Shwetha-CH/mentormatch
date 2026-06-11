package com.mentormatch.app.dto;

import com.mentormatch.app.entity.SupportTicket.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SupportTicketRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    // ── Constructors ──────────────────────────────────────────

    public SupportTicketRequest() {}

    public SupportTicketRequest(String subject, String message, TicketCategory category) {
        this.subject = subject;
        this.message = message;
        this.category = category;
    }

    // ── Getters & Setters ─────────────────────────────────────

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }
}