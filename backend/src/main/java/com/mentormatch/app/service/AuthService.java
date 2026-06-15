package com.mentormatch.app.service;

import com.mentormatch.app.dto.AuthResponse;
import com.mentormatch.app.dto.LoginRequest;
import com.mentormatch.app.dto.RefreshTokenRequest;
import com.mentormatch.app.dto.RegisterRequest;
import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.Role;
import com.mentormatch.app.entity.StudentProfile;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.MentorRepository;
import com.mentormatch.app.repository.StudentRepository;
import com.mentormatch.app.repository.UserRepository;
import com.mentormatch.app.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final StudentRepository studentRepository;
    private final MentorRepository mentorRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuthenticationManager authenticationManager, 
                       StudentRepository studentRepository, 
                       MentorRepository mentorRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.studentRepository = studentRepository;
        this.mentorRepository = mentorRepository;
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role. Allowed values: STUDENT, MENTOR");
        }

        if (role == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot register as ADMIN");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                true
        );

        User savedUser = userRepository.save(user);

        if (role == Role.STUDENT) {
            StudentProfile studentProfile = new StudentProfile();
            studentProfile.setUser(savedUser);
            studentProfile.setTotalSessions(0);
            studentRepository.save(studentProfile);
        } else if (role == Role.MENTOR) {
            MentorProfile mentorProfile = new MentorProfile();
            mentorProfile.setUser(savedUser);
            mentorProfile.setSkills(new ArrayList<>());
            mentorProfile.setIsAvailable(true);
            mentorProfile.setRating(0.0);
            mentorRepository.save(mentorProfile);
        }
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("Login attempt for email: " + request.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            System.out.println("Authentication successful for: " + request.getEmail());
        } catch (Exception e) {
            System.out.println("Authentication failed for: " + request.getEmail() + " Error: " + e.getMessage());
            throw e;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        System.out.println("Tokens generated for: " + request.getEmail());
        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getRole().name(),
                user.getFullName(),
                user.getEmail()
        );
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getRole().name(),
                user.getFullName(),
                user.getEmail()
        );
    }
}
