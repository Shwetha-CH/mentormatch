package com.mentormatch.app.dto;

import java.util.List;

public class AdminSessionResponse {
    private Long sessionId;
    private String mentorName;
    private String mentorEmail;
    private String studentName;
    private String studentEmail;
    private String topic;
    private String planType;
    private String status;
    private Integer totalOccurrences;
    private String createdAt;
    private List<OccurrenceDetail> occurrences;

    public static class OccurrenceDetail {
        private Long occurrenceId;
        private String scheduledAt;
        private Integer durationMinutes;
        private String meetingLink;
        private String status;

        public OccurrenceDetail() {}

        public OccurrenceDetail(Long occurrenceId, String scheduledAt, Integer durationMinutes,
                                String meetingLink, String status) {
            this.occurrenceId = occurrenceId;
            this.scheduledAt = scheduledAt;
            this.durationMinutes = durationMinutes;
            this.meetingLink = meetingLink;
            this.status = status;
        }

        // Getters & Setters
        public Long getOccurrenceId() { return occurrenceId; }
        public void setOccurrenceId(Long occurrenceId) { this.occurrenceId = occurrenceId; }

        public String getScheduledAt() { return scheduledAt; }
        public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

        public String getMeetingLink() { return meetingLink; }
        public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // Getters & Setters
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }

    public String getMentorEmail() { return mentorEmail; }
    public void setMentorEmail(String mentorEmail) { this.mentorEmail = mentorEmail; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public List<OccurrenceDetail> getOccurrences() { return occurrences; }
    public void setOccurrences(List<OccurrenceDetail> occurrences) { this.occurrences = occurrences; }
}