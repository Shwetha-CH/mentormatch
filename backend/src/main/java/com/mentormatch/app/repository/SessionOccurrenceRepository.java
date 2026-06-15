package com.mentormatch.app.repository;

import com.mentormatch.app.entity.SessionOccurrence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionOccurrenceRepository extends JpaRepository<SessionOccurrence, Long> {
}