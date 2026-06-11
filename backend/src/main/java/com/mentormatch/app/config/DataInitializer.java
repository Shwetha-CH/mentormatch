package com.mentormatch.app.config;

import com.mentormatch.app.entity.Role;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class xDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@mentormatch.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                    "Admin",
                    adminEmail,
                    passwordEncoder.encode("Admin@1234"),
                    Role.ADMIN,
                    true
            );
            userRepository.save(admin);
            System.out.println("Admin user seeded successfully.");
        } else {
            System.out.println("Admin user already exists. Skipping seed.");
        }
    }
}
