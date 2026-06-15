package com.mentormatch.app.service;

import com.mentormatch.app.dto.ReviewRequest;
import com.mentormatch.app.dto.ReviewResponse;
import com.mentormatch.app.entity.*;
import com.mentormatch.app.entity.Review.ReviewerRole;
import com.mentormatch.app.repository.MentorRepository;
import com.mentormatch.app.repository.ReviewRepository;
import com.mentormatch.app.repository.SessionRepository;
import com.mentormatch.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         SessionRepository sessionRepository,
                         UserRepository userRepository,
                         MentorRepository mentorRepository,
                         NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.mentorRepository = mentorRepository;
        this.notificationService = notificationService;
    }

    // POST /api/reviews/sessions/{sessionId}
    @Transactional
    public ReviewResponse submitReview(Long sessionId, ReviewRequest request, String currentUserEmail) {

        // 1. Load session
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // 2. Must be COMPLETED
        if (session.getStatus() != Session.SessionStatus.COMPLETE) {
            throw new IllegalArgumentException("Reviews can only be submitted for completed sessions.");
        }

        // 3. Get current user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long studentUserId = session.getStudent().getUser().getId();
        Long mentorUserId  = session.getMentor().getUser().getId();
        Long currentUserId = currentUser.getId();

        boolean isStudent = currentUserId.equals(studentUserId);
        boolean isMentor  = currentUserId.equals(mentorUserId);

        // 4. Must be a participant
        if (!isStudent && !isMentor) {
            throw new IllegalArgumentException("You are not a participant of this session.");
        }

        // 5. Prevent duplicate review
        if (reviewRepository.existsBySessionIdAndReviewerId(sessionId, currentUserId)) {
            throw new IllegalArgumentException("You have already reviewed this session.");
        }

        // 6. Determine reviewee and role
        Long revieweeUserId = isStudent ? mentorUserId : studentUserId;
        ReviewerRole role   = isStudent ? ReviewerRole.STUDENT : ReviewerRole.MENTOR;

        User reviewee = userRepository.findById(revieweeUserId)
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        // 7. Save review
        Review review = new Review();
        review.setSession(session);
        review.setReviewer(currentUser);
        review.setReviewee(reviewee);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewerRole(role);

        Review saved = reviewRepository.save(review);

        // 8. If student reviewed mentor → recalculate mentor rating
        if (isStudent) {
            recalculateMentorRating(mentorUserId);
        }

        // 9. Notify the reviewee
        notificationService.send(
                revieweeUserId,
                currentUser.getFullName() + " left you a review!",
                currentUser.getFullName() + " rated you " + request.getRating() + "/5.",
                isStudent ? "/mentor/sessions/" + sessionId : "/student/sessions/" + sessionId
        );

        return toResponse(saved);
    }

    // GET /api/reviews/mentors/{mentorId} — public
    public List<ReviewResponse> getMentorReviews(Long mentorId) {
        MentorProfile mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        return reviewRepository.findMentorReviewsByUserId(mentor.getUser().getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // GET /api/reviews/sessions/{sessionId}
    public List<ReviewResponse> getSessionReviews(Long sessionId) {
        return reviewRepository.findBySessionId(sessionId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Recalculate and save mentor's rating field
    private void recalculateMentorRating(Long mentorUserId) {
        mentorRepository.findByUserId(mentorUserId).ifPresent(mentor -> {
            Double avg = reviewRepository.calculateAvgRatingForMentor(mentorUserId);
            mentor.setRating(avg != null ? avg : 0.0);
            mentorRepository.save(mentor);
        });
    }

    private ReviewResponse toResponse(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setSessionId(r.getSession().getId());
        res.setReviewerId(r.getReviewer().getId());
        res.setReviewerName(r.getReviewer().getFullName());
        res.setReviewerPhotoUrl(null);
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setReviewerRole(r.getReviewerRole());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }
}