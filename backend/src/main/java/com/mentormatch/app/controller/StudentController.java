package com.mentormatch.app.controller;

import com.mentormatch.app.dto.ApiResponse;
import com.mentormatch.app.dto.StudentProfileResponse;
import com.mentormatch.app.dto.UpdateStudentRequest;
import com.mentormatch.app.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;


    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // GET /api/students/me
    @GetMapping("/me")
    public ResponseEntity<StudentProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                studentService.getMyProfile(userDetails.getUsername()));
    }

    // PUT /api/students/me
    @PutMapping("/me")
    public ResponseEntity<StudentProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateStudentRequest req) {
        return ResponseEntity.ok(
                studentService.updateProfile(userDetails.getUsername(), req));
    }
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMyAccount(
            @AuthenticationPrincipal UserDetails userDetails) {
        studentService.deleteAccount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }
}