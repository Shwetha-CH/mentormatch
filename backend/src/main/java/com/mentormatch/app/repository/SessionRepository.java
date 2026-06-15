package com.mentormatch.app.repository;

import com.mentormatch.app.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("SELECT s FROM Session s WHERE s.mentor.id = :mentorId")
    List<Session> findAllSessionsByMentorId(@Param("mentorId") Long mentorId);

    @Query("SELECT s FROM Session s WHERE s.student.id = :studentId")
    List<Session> findAllSessionsByStudentId(@Param("studentId") Long studentId);
}