package com.mentormatch.app.repository;

import com.mentormatch.app.entity.Review;
import com.mentormatch.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewer(User reviewer);
    List<Review> findByReviewee(User reviewee);

    // All student→mentor reviews for a mentor's public profile
    @Query("SELECT r FROM Review r WHERE r.reviewee.id = :userId " +
            "AND r.reviewerRole = com.mentormatch.app.entity.Review$ReviewerRole.STUDENT " +
            "ORDER BY r.createdAt DESC")
    List<Review> findMentorReviewsByUserId(@Param("userId") Long userId);

    // Check if reviewer already reviewed this session
    boolean existsBySessionIdAndReviewerId(Long sessionId, Long reviewerId);

    // Both reviews for a session (max 2)
    List<Review> findBySessionId(Long sessionId);

    // Average rating for a mentor (from student reviews only)
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r " +
            "WHERE r.reviewee.id = :userId " +
            "AND r.reviewerRole = com.mentormatch.app.entity.Review$ReviewerRole.STUDENT")
    Double calculateAvgRatingForMentor(@Param("userId") Long userId);
}