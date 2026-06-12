package com.mentormatch.app.dto;

import java.util.List;

public class MentorProfileRequest {

    private String bio;
    private String industry;
    private List<String> skills;

    // --- Getters & Setters ---

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
