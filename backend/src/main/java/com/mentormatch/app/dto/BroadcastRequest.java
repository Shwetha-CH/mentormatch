package com.mentormatch.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BroadcastRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    // ALL / STUDENT / MENTOR
    @NotNull(message = "Target audience is required")
    private TargetAudience targetAudience;

    // Whether to also send an email along with in-app notification
    private boolean sendEmail = false;

    public enum TargetAudience {
        ALL,
        STUDENT,
        MENTOR
    }

    // ── Constructors ──────────────────────────────────────────

    public BroadcastRequest() {}

    public BroadcastRequest(String title, String message, TargetAudience targetAudience, boolean sendEmail) {
        this.title = title;
        this.message = message;
        this.targetAudience = targetAudience;
        this.sendEmail = sendEmail;
    }

    // ── Getters & Setters ─────────────────────────────────────

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public TargetAudience getTargetAudience() { return targetAudience; }
    public void setTargetAudience(TargetAudience targetAudience) { this.targetAudience = targetAudience; }

    public boolean isSendEmail() { return sendEmail; }
    public void setSendEmail(boolean sendEmail) { this.sendEmail = sendEmail; }
}