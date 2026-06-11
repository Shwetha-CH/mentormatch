package com.mentormatch.app.dto;

public class UpdateStudentRequest {

    private String headline;
    private String goals;
    private String interests;
    private String currentRole;

    public UpdateStudentRequest() {}

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getCurrentRole() { return currentRole; }
    public void setCurrentRole(String currentRole) { this.currentRole = currentRole; }
}