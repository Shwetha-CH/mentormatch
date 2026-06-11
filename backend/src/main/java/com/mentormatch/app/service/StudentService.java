package com.mentormatch.app.service;

import com.mentormatch.app.dto.StudentProfileResponse;
import com.mentormatch.app.dto.UpdateStudentRequest;
import com.mentormatch.app.entity.StudentProfile;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.StudentRepository;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepo;
    private final UserRepository userRepo;

    public StudentService(StudentRepository studentRepo,
                          UserRepository userRepo) {
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
    }

    public StudentProfileResponse getMyProfile(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        StudentProfile profile = studentRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return mapToResponse(profile);
    }

    public StudentProfileResponse updateProfile(String email, UpdateStudentRequest req) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //git First call → creates profile | Subsequent calls → updates it
        StudentProfile profile = studentRepo.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    p.setTotalSessions(0);
                    return p;
                });

        profile.setHeadline(req.getHeadline());
        profile.setGoals(req.getGoals());
        profile.setInterests(req.getInterests());
        profile.setCurrentRole(req.getCurrentRole());

        return mapToResponse(studentRepo.save(profile));
    }

    private StudentProfileResponse mapToResponse(StudentProfile profile) {
        StudentProfileResponse res = new StudentProfileResponse();
        res.setId(profile.getId());
        res.setFullName(profile.getUser().getFullName());
        res.setEmail(profile.getUser().getEmail());
        res.setHeadline(profile.getHeadline());
        res.setGoals(profile.getGoals());
        res.setInterests(profile.getInterests());
        res.setCurrentRole(profile.getCurrentRole());
        res.setTotalSessions(profile.getTotalSessions());
        return res;
    }
}