package com.mentormatch.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SessionRequest {

    @NotBlank(message = "Topic is required")
    private String topic;

    private String message;

    @NotNull(message = "Plan type is required")
    private String planType;

    @NotNull(message = "Total occurrences is required")
    private Integer totalOccurrences;

    @NotNull(message = "Mentor ID is required")
    private Long mentorId;

    // Date and time the student wants the session — e.g. "2026-06-20T10:00:00"
    @NotBlank(message = "Scheduled date and time is required")
    private String scheduledAt;

    // Duration in minutes — 60 or 120
    @NotNull(message = "Duration is required")
    private Integer durationMinutes;

    public SessionRequest() {}

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public Integer getTotalOccurrences() { return totalOccurrences; }
    public void setTotalOccurrences(Integer totalOccurrences) { this.totalOccurrences = totalOccurrences; }

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}