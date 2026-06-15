package com.mentormatch.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SessionRequest {

    @NotBlank(message = "Topic is required")
    private String topic;

    private String message;

    @NotNull(message = "Plan type is required")
    private String planType; // SINGLE, WEEKLY, MONTHLY

    @NotNull(message = "Total occurrences is required")
    private Integer totalOccurrences;

    @NotNull(message = "Mentor ID is required")
    private Long mentorId;

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
}