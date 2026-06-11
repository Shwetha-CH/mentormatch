package com.mentormatch.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id",
            nullable = false, unique = true)
    private User user;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @Column(name = "interests", length = 500)
    private String interests;

    @Column(name = "current_role", length = 100)
    private String currentRole;

    @Column(name = "total_sessions")
    private Integer totalSessions = 0;

    // Constructors
    public StudentProfile() {}

    public StudentProfile(User user, String headline, String goals,
                          String interests, String currentRole) {
        this.user = user;
        this.headline = headline;
        this.goals = goals;
        this.interests = interests;
        this.currentRole = currentRole;
        this.totalSessions = 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getCurrentRole() { return currentRole; }
    public void setCurrentRole(String currentRole) { this.currentRole = currentRole; }

    public Integer getTotalSessions() { return totalSessions; }
    public void setTotalSessions(Integer totalSessions) { this.totalSessions = totalSessions; }
}