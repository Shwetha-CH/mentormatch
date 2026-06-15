package com.mentormatch.app.dto;

import java.util.List;

public class SessionResponse {
    private Long sessionId;
    private String studentName;
    private String studentEmail;
    private String topic;
    private String planType;
    private String status;
    private Integer totalOccurrences;
    private List<OccurrenceSummary> occurrences;

    public SessionResponse() {}

    // --- Getters & Setters ---
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTotalOccurrences() { return totalOccurrences; }
    public void setTotalOccurrences(Integer totalOccurrences) { this.totalOccurrences = totalOccurrences; }

    public List<OccurrenceSummary> getOccurrences() { return occurrences; }
    public void setOccurrences(List<OccurrenceSummary> occurrences) { this.occurrences = occurrences; }

    public static class OccurrenceSummary {
        private Long id;
        private String scheduledAt;
        private Integer durationMinutes;
        private String meetingLink;
        private String status;

        public OccurrenceSummary(Long id, String scheduledAt, Integer durationMinutes, String meetingLink, String status) {
            this.id = id;
            this.scheduledAt = scheduledAt;
            this.durationMinutes = durationMinutes;
            this.meetingLink = meetingLink;
            this.status = status;
        }

        // --- Getters & Setters ---
        public Long getId() { return id; }
        public String getScheduledAt() { return scheduledAt; }
        public Integer getDurationMinutes() { return durationMinutes; }
        public String getMeetingLink() { return meetingLink; }
        public String getStatus() { return status; }
    }
}