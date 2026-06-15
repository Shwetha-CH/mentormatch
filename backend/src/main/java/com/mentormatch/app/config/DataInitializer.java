package com.mentormatch.app.config;

import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.Role;
import com.mentormatch.app.entity.StudentProfile;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final MentorRepository mentorRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(UserRepository userRepository, 
                           StudentRepository studentRepository,
                           MentorRepository mentorRepository,
                           ReviewRepository reviewRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder,
                           JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.mentorRepository = mentorRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        cleanupSchema();
        seedAdmin();
        seedStudent();
        seedMentor();
    }

    private void cleanupSchema() {
        try {
            // Drop the old column if it still exists to prevent "Field 'password_hash' doesn't have a default value" error
            jdbcTemplate.execute("ALTER TABLE users DROP COLUMN password_hash");
            System.out.println("Old 'password_hash' column dropped successfully.");
        } catch (Exception e) {
            // Column might already be gone, which is fine
        }
    }

    private void seedAdmin() {
        String adminEmail = "admin@mentormatch.com";
        userRepository.findByEmail(adminEmail).ifPresent(user -> {
            notificationRepository.deleteAll(notificationRepository.findByUser(user));
            userRepository.delete(user);
        });
        
        User admin = new User();
        admin.setFullName("Admin User");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode("Admin@1234"));
        admin.setRole(Role.ADMIN);
        admin.setIsActive(true);
        
        userRepository.save(admin);
        System.out.println("Admin user re-seeded successfully.");
    }

    private void seedStudent() {
        String studentEmail = "student@mentormatch.com";
        userRepository.findByEmail(studentEmail).ifPresent(user -> {
            reviewRepository.deleteAll(reviewRepository.findByReviewer(user));
            reviewRepository.deleteAll(reviewRepository.findByReviewee(user));
            notificationRepository.deleteAll(notificationRepository.findByUser(user));
            studentRepository.findByUser(user).ifPresent(studentRepository::delete);
            userRepository.delete(user);
        });
        
        User student = new User();
        student.setFullName("Default Student");
        student.setEmail(studentEmail);
        student.setPassword(passwordEncoder.encode("Student@1234"));
        student.setRole(Role.STUDENT);
        student.setIsActive(true);
        User savedUser = userRepository.save(student);

        StudentProfile profile = new StudentProfile();
        profile.setUser(savedUser);
        profile.setHeadline("Eager Learner");
        profile.setTotalSessions(0);
        studentRepository.save(profile);
        
        System.out.println("Student user re-seeded successfully.");
    }

    private void seedMentor() {
        String mentorEmail = "mentor@mentormatch.com";
        userRepository.findByEmail(mentorEmail).ifPresent(user -> {
            reviewRepository.deleteAll(reviewRepository.findByReviewer(user));
            reviewRepository.deleteAll(reviewRepository.findByReviewee(user));
            notificationRepository.deleteAll(notificationRepository.findByUser(user));
            mentorRepository.findByUserId(user.getId()).ifPresent(mentorRepository::delete);
            userRepository.delete(user);
        });
        
        User mentor = new User();
        mentor.setFullName("Default Mentor");
        mentor.setEmail(mentorEmail);
        mentor.setPassword(passwordEncoder.encode("Mentor@1234"));
        mentor.setRole(Role.MENTOR);
        mentor.setIsActive(true);
        User savedUser = userRepository.save(mentor);

        MentorProfile profile = new MentorProfile();
        profile.setUser(savedUser);
        profile.setIndustry("Technology");
        profile.setBio("Experienced software engineer");
        profile.setHourlyRate(50);
        profile.setSkills(new ArrayList<>());
        profile.setRating(5.0);
        profile.setIsAvailable(true);
        mentorRepository.save(profile);
        
        System.out.println("Mentor user re-seeded successfully.");
    }
}
