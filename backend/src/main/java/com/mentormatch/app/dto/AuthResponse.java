package com.mentormatch.app.dto;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String role;
    private String fullName;
    private String email;

    // --- Constructors ---

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, String role, String fullName, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }

    // --- Getters ---

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    // --- Setters ---

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
