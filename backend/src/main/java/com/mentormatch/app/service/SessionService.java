package com.mentormatch.app.service;

import com.mentormatch.app.dto.SessionRequest;
import com.mentormatch.app.dto.SessionResponse;
import com.mentormatch.app.entity.MentorProfile;
import com.mentormatch.app.entity.Session;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.MentorRepository;
import com.mentormatch.app.repository.SessionRepository;
import com.mentormatch.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final MentorRepository mentorRepository;

    public SessionService(SessionRepository sessionRepository,
                          UserRepository userRepository,
                          NotificationService notificationService,
                          MentorRepository mentorRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.mentorRepository = mentorRepository;
    }

    // POST /api/sessions — Student books a session
    @Transactional
    public SessionResponse bookSession(SessionRequest request, String studentEmail) {

        // 1. Get student
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 2. Get mentor — mentorId from frontend is MentorProfile.id not User.id
        MentorProfile mentorProfile = mentorRepository.findById(request.getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        User mentor = mentorProfile.getUser();

        // 3. Create session
        Session session = new Session();
        session.setMentor(mentor);
        session.setStudent(student);
        session.setTopic(request.getTopic());
        session.setMessage(request.getMessage());
        session.setPlanType(Session.PlanType.valueOf(request.getPlanType()));
        session.setTotalOccurrences(request.getTotalOccurrences());
        session.setStatus(Session.SessionStatus.PENDING);

        Session saved = sessionRepository.save(session);

        // 4. Notify mentor
        notificationService.send(
                mentor.getId(),
                "New Session Request!",
                student.getFullName() + " wants to book a session with you: " + request.getTopic(),
                "/mentor/sessions/" + saved.getId()
        );

        return toResponse(saved);
    }

    // GET /api/sessions/my — Get student's sessions
    public List<SessionResponse> getMySessions(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return sessionRepository.findAllSessionsByStudentId(student.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // GET /api/sessions/mentor — Get mentor's sessions
    public List<SessionResponse> getMentorSessions(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        return sessionRepository.findAllSessionsByMentorId(mentor.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // PATCH /api/sessions/{id}/accept — Mentor accepts session
    @Transactional
    public SessionResponse acceptSession(Long sessionId, String mentorEmail, String meetingLink) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(Session.SessionStatus.ACCEPTED);
        Session saved = sessionRepository.save(session);

        // Notify student
        notificationService.send(
                session.getStudent().getId(),
                "Session Accepted!",
                session.getMentor().getFullName() + " accepted your session: " + session.getTopic(),
                "/student/sessions/" + sessionId
        );

        return toResponse(saved);
    }

    // PATCH /api/sessions/{id}/reject — Mentor rejects session
    @Transactional
    public SessionResponse rejectSession(Long sessionId, String mentorEmail) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(Session.SessionStatus.REJECTED);
        Session saved = sessionRepository.save(session);

        // Notify student
        notificationService.send(
                session.getStudent().getId(),
                "Session Rejected",
                session.getMentor().getFullName() + " rejected your session: " + session.getTopic(),
                "/student/sessions/" + sessionId
        );

        return toResponse(saved);
    }

    private SessionResponse toResponse(Session s) {
        SessionResponse res = new SessionResponse();
        res.setId(s.getId());
        res.setTopic(s.getTopic());
        res.setMessage(s.getMessage());
        res.setStatus(s.getStatus().name());
        res.setPlanType(s.getPlanType().name());
        res.setTotalOccurrences(s.getTotalOccurrences());
        res.setCreatedAt(s.getCreatedAt());
        res.setMentorId(s.getMentor().getId());
        res.setMentorName(s.getMentor().getFullName());
        res.setStudentId(s.getStudent().getId());
        res.setStudentName(s.getStudent().getFullName());
        return res;
    }
}