package com.mentormatch.app.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id",
            nullable = false, unique = true)
    private User user;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @Column(name = "interests", length = 500)
    private String interests;

    @Column(name = "current_role", length = 100)
    private String currentRole;

    @Column(name = "total_sessions")
    private Integer totalSessions = 0;
}