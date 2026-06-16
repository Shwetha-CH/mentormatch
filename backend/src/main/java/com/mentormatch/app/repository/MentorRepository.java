package com.mentormatch.app.repository;

import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<MentorProfile, Long> {

    // 1. Find a profile by the associated User's ID
    Optional<MentorProfile> findByUserId(Long userId);
    
    boolean existsByUser(User user);

    // 2. Custom query to handle the "Browse + Filters" feature dynamically
    // The LEFT JOIN is used to search within the 'skills' collection array we defined in the entity
    @Query("SELECT DISTINCT m FROM MentorProfile m LEFT JOIN m.skills s " +
            "WHERE m.isAvailable = true " +
            "AND m.user.isActive = true " +
            "AND (:industry IS NULL OR m.industry = :industry) " +
            "AND (:minRating IS NULL OR m.rating >= :minRating) " +
            "AND (:skill IS NULL OR s = :skill)")
    List<MentorProfile> findAvailableMentorsWithFilters(
            @Param("industry") String industry,
            @Param("minRating") Double minRating,
            @Param("skill") String skill
    );

    // 3. For the /api/mentors/recommended endpoint (e.g., top-rated available mentors)
    @Query("SELECT m FROM MentorProfile m WHERE m.isAvailable = true AND m.user.isActive = true ORDER BY m.rating DESC LIMIT 5")
    List<MentorProfile> findTop5ByIsAvailableTrueOrderByRatingDesc();
}