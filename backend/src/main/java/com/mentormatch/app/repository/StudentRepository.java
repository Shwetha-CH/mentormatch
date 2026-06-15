package com.mentormatch.app.repository;

import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.StudentProfile;
import com.mentormatch.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

import java.util.Optional;

@Repository
public interface StudentRepository  extends JpaRepository<StudentProfile,Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserEmail(String email);
    boolean existsByUser(User user);
    void deleteByUser(User user);
}
