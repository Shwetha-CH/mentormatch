package com.mentormatch.app.dto;

public class RefreshTokenRequest {

    private String refreshToken;

    // --- Constructors ---

    public RefreshTokenRequest() {}

    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // --- Getters ---

    public String getRefreshToken() {
        return refreshToken;
    }

    // --- Setters ---

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
