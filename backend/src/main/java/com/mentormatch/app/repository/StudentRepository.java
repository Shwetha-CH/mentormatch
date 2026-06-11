package com.mentormatch.app.repository;

import com.mentormatch.app.entity.User;
import com.mentormatch.app.entity.user_student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

import java.util.Optional;

@Repository
public interface StudentRepository  extends JpaRepository<user_student,Long> {
    Optional<user_student> findBySid(Long sid);

    boolean existsBySid(Long sid);
}
