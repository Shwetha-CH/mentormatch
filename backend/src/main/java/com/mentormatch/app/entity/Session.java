package com.mentormatch.app.entity;

public enum Session { ;
    public enum PlanType {
        SINGLE, DAILY, WEEKLY, MONTHLY
    }

    // SessionStatus.java
    public enum SessionStatus {
        PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETE
    }

    // OccurrenceStatus.java (already exists with Role)
    public enum OccurrenceStatus {
        UPCOMING, COMPLETED, CANCELLED
    }
}


