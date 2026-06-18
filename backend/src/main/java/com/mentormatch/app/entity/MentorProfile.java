package com.mentormatch.app.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "mentor_profiles")
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A Mentor Profile belongs to exactly one User.
    // FetchType.LAZY ensures the User data is only loaded when explicitly
    // requested, optimizing performance.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`user_id`", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "`industry`")
    private String industry;

    @Column(name = "`hourly_rate`")
    private Integer hourlyRate;

    // Creates a separate table 'mentor_skills' to store multiple tags/skills for a
    // mentor,
    // which helps with your "Browse filters" feature.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "mentor_skills", joinColumns = @JoinColumn(name = "`mentor_profile_id`"))
    @Column(name = "`skill`")
    private List<String> skills;

    // Supports the "Availability toggle UI"
    @Column(name = "`is_available`", nullable = false)
    private Boolean isAvailable = true;

    // Supports the rating filter on the browse page
    @Column(name = "`rating`")
    private Double rating = 0.0;

    public MentorProfile() {
    }

    public MentorProfile(User user, String industry, Integer hourlyRate, List<String> skills) {
        this.user = user;
        this.industry = industry;
        this.hourlyRate = hourlyRate;
        this.skills = skills;
        this.isAvailable = true;
        this.rating = 0.0;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public Integer getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Integer hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}
