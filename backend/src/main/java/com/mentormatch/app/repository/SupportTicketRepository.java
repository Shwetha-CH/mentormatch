package com.mentormatch.app.repository;

import com.mentormatch.app.entity.SupportTicket;
import com.mentormatch.app.entity.SupportTicket.TicketStatus;
import com.mentormatch.app.entity.SupportTicket.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    // 1. Get all tickets for a specific user (for user-side view)
    List<SupportTicket> findByUserId(Long userId);

    // 2. Filter by status (OPEN / IN_PROGRESS / RESOLVED)
    List<SupportTicket> findByStatus(TicketStatus status);

    // 3. Filter by category (SESSION_ISSUE / TECHNICAL etc.)
    List<SupportTicket> findByCategory(TicketCategory category);

    // 4. Filter by both status and category together
    List<SupportTicket> findByStatusAndCategory(TicketStatus status, TicketCategory category);

    // 5. Count open tickets — used in admin dashboard stats card
    long countByStatus(TicketStatus status);
}