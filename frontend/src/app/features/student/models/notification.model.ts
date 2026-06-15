// src/app/models/notification.model.ts

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}