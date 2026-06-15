package com.mentormatch.app.service;

import com.mentormatch.app.dto.AcceptSessionRequest;
import com.mentormatch.app.dto.SessionResponse;
import com.mentormatch.app.entity.*;
import com.mentormatch.app.repository.SessionOccurrenceRepository;
import com.mentormatch.app.repository.SessionRepository;
import com.mentormatch.app.repository.StudentRepository;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SessionOccurrenceRepository occurrenceRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public SessionService(SessionRepository sessionRepository, 
                          SessionOccurrenceRepository occurrenceRepository, 
                          UserRepository userRepository,
                          StudentRepository studentRepository) {
        this.sessionRepository = sessionRepository;
        this.occurrenceRepository = occurrenceRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    public List<SessionResponse> getMySessions(String email) {
        User mentor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mentor user not found."));

        return sessionRepository.findAllSessionsByMentorId(mentor.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public SessionResponse acceptSession(Long sessionId, AcceptSessionRequest request) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session request not found."));

        if (!session.getStatus().equals(SessionStatus.PENDING)) {
            throw new RuntimeException("Can only accept pending session requests.");
        }

        session.setStatus(SessionStatus.ACCEPTED);

        // Cascade acceptance and meeting link out to all individual child occurrences
        for (SessionOccurrence occurrence : session.getOccurrences()) {
            occurrence.setStatus(SessionStatus.ACCEPTED);
            occurrence.setMeetingLink(request.getMeetingLink());
        }

        // Safely update Student profile total session tracking limits
        StudentProfile studentProfile = studentRepository.findByUser(session.getStudent())
                .orElse(null);
        if (studentProfile != null) {
            studentProfile.setTotalSessions(studentProfile.getTotalSessions() + session.getTotalOccurrences());
            studentRepository.save(studentProfile);
        }

        return mapToResponse(sessionRepository.save(session));
    }

    @Transactional
    public SessionResponse rejectSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session request not found."));

        if (!session.getStatus().equals(SessionStatus.PENDING)) {
            throw new RuntimeException("Can only reject pending session requests.");
        }

        session.setStatus(SessionStatus.REJECTED);
        for (SessionOccurrence occurrence : session.getOccurrences()) {
            occurrence.setStatus(SessionStatus.REJECTED);
        }

        return mapToResponse(sessionRepository.save(session));
    }

    @Transactional
    public SessionResponse cancelIndividualOccurrence(Long occurrenceId) {
        SessionOccurrence occurrence = occurrenceRepository.findById(occurrenceId)
                .orElseThrow(() -> new RuntimeException("Occurrence timeline slot not found."));

        occurrence.setStatus(SessionStatus.CANCELLED);
        occurrenceRepository.save(occurrence);

        // Optimization check: If every single occurrence inside a plan gets cancelled, mark the parent session cancelled too.
        Session parentSession = occurrence.getSession();
        boolean allCancelled = parentSession.getOccurrences().stream()
                .allMatch(o -> o.getStatus().equals(SessionStatus.CANCELLED));
        
        if (allCancelled) {
            parentSession.setStatus(SessionStatus.CANCELLED);
            sessionRepository.save(parentSession);
        }

        return mapToResponse(parentSession);
    }

    private SessionResponse mapToResponse(Session session) {
        SessionResponse res = new SessionResponse();
        res.setSessionId(session.getId());
        res.setStudentName(session.getStudent().getFullName());
        res.setStudentEmail(session.getStudent().getEmail());
        res.setTopic(session.getTopic());
        res.setPlanType(session.getPlanType().name());
        res.setStatus(session.getStatus().name());
        res.setTotalOccurrences(session.getTotalOccurrences());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<SessionResponse.OccurrenceSummary> list = session.getOccurrences().stream()
                .map(o -> new SessionResponse.OccurrenceSummary(
                        o.getId(),
                        o.getScheduledAt().format(formatter),
                        o.getDurationMinutes(),
                        o.getMeetingLink(),
                        o.getStatus().name()
                )).toList();

        res.setOccurrences(list);
        return res;
    }
}