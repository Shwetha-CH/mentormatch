package com.mentormatch.app.repository;

import com.mentormatch.app.entity.Session;
import com.mentormatch.app.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Fetches and groups items directly belonging to the active mentor
    @Query("SELECT DISTINCT s FROM Session s LEFT JOIN FETCH s.occurrences o " +
           "WHERE s.mentor.id = :mentorId " +
           "ORDER BY s.createdAt DESC")
    List<Session> findAllSessionsByMentorId(@Param("mentorId") Long mentorId);

    @Query("SELECT DISTINCT s FROM Session s LEFT JOIN FETCH s.occurrences " +
            "ORDER BY s.createdAt DESC")
    List<Session> findAllSessionsWithOccurrences();

    // Count sessions by status
    long countByStatus(SessionStatus status);

    // Get sessions filtered by status
    List<Session> findByStatusOrderByCreatedAtDesc(SessionStatus status);
    // Get last 5 sessions
    @Query("SELECT s FROM Session s ORDER BY s.createdAt DESC")
    List<Session> findTop5ByOrderByCreatedAtDesc();
}