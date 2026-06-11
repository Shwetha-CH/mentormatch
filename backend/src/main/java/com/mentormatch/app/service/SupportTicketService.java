package com.mentormatch.app.service;

import com.mentormatch.app.dto.SupportReplyRequest;
import com.mentormatch.app.dto.SupportTicketRequest;
import com.mentormatch.app.entity.SupportTicket;
import com.mentormatch.app.entity.SupportTicket.TicketCategory;
import com.mentormatch.app.entity.SupportTicket.TicketStatus;
import com.mentormatch.app.entity.User;
import com.mentormatch.app.repository.SupportTicketRepository;
import com.mentormatch.app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;

    public SupportTicketService(SupportTicketRepository supportTicketRepository,
                                UserRepository userRepository) {
        this.supportTicketRepository = supportTicketRepository;
        this.userRepository = userRepository;
    }

    // 1. User raises a new ticket
    public SupportTicket createTicket(Long userId, SupportTicketRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportTicket ticket = new SupportTicket(
                user,
                request.getSubject(),
                request.getMessage(),
                request.getCategory()
        );

        return supportTicketRepository.save(ticket);
    }

    // 2. Admin gets all tickets (no filter)
    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    // 3. Admin filters tickets by status
    public List<SupportTicket> getTicketsByStatus(TicketStatus status) {
        return supportTicketRepository.findByStatus(status);
    }

    // 4. Admin filters tickets by category
    public List<SupportTicket> getTicketsByCategory(TicketCategory category) {
        return supportTicketRepository.findByCategory(category);
    }

    // 5. Admin filters by both status and category
    public List<SupportTicket> getTicketsByStatusAndCategory(TicketStatus status, TicketCategory category) {
        return supportTicketRepository.findByStatusAndCategory(status, category);
    }

    // 6. Admin opens a ticket and replies
    public SupportTicket replyToTicket(Long ticketId, SupportReplyRequest request) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAdminReply(request.getAdminReply());
        ticket.setStatus(request.getStatus());
        ticket.setRepliedAt(LocalDateTime.now());

        return supportTicketRepository.save(ticket);
    }

    // 7. Get a single ticket by ID
    public SupportTicket getTicketById(Long ticketId) {
        return supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // 8. Count open tickets — used in admin dashboard stats
    public long countOpenTickets() {
        return supportTicketRepository.countByStatus(TicketStatus.OPEN);
    }
}