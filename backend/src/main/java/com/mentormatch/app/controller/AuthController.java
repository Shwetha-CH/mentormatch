package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.AuthResponse;
import com.mentormatch.app.dto.LoginRequest;
import com.mentormatch.app.dto.RefreshTokenRequest;
import com.mentormatch.app.dto.RegisterRequest;
import com.mentormatch.app.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity
                .ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        AuthResponse authResponse = authService.refreshToken(request);
        return ResponseEntity
                .ok(ApiResponse.success("Token refreshed successfully", authResponse));
    }
}
