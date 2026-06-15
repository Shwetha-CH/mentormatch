package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.StudentProfileResponse;
import com.mentormatch.app.dto.UpdateStudentRequest;
import com.mentormatch.app.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(StudentController.class);
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // GET /api/students/me
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(Authentication authentication) {
        logger.info("Received request for student profile: {}", authentication.getName());
        try {
            String email = authentication.getName();
            StudentProfileResponse profile = studentService.getMyProfile(email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile retrieved", profile));
        } catch (Exception e) {
            logger.error("Error retrieving student profile for {}: {}", authentication.getName(), e.getMessage());
            throw e;
        }
    }

    // PUT /api/students/me
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            Authentication authentication,
            @RequestBody UpdateStudentRequest req) {
        String email = authentication.getName();
        StudentProfileResponse updated = studentService.updateProfile(email, req);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated", updated));
    }

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMyAccount(Authentication authentication) {
        String email = authentication.getName();
        studentService.deleteAccount(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Account deleted successfully", null));
    }
}