package com.mentormatch.app.dto;

import java.util.List;

public class MentorProfileResponse {

    private Long id;
    private UserSummary user;
    private String bio;
    private String industry;
    private Integer hourlyRate;
    private List<String> skills;
    private Boolean isAvailable;
    private Double rating;

    public MentorProfileResponse() {}

    public MentorProfileResponse(Long id, UserSummary user, String bio, String industry, Integer hourlyRate,
                                 List<String> skills, Boolean isAvailable, Double rating) {
        this.id = id;
        this.user = user;
        this.bio = bio;
        this.industry = industry;
        this.hourlyRate = hourlyRate;
        this.skills = skills;
        this.isAvailable = isAvailable;
        this.rating = rating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserSummary getUser() { return user; }
    public void setUser(UserSummary user) { this.user = user; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public Integer getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Integer hourlyRate) { this.hourlyRate = hourlyRate; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public static class UserSummary {
        private Long id;
        private String fullName;
        private String email;

        public UserSummary() {}

        public UserSummary(Long id, String fullName, String email) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
