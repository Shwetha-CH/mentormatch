// src/app/shared/notification-bell/notification-bell.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../models/notification.model';

@Component({
    selector: 'app-notification-bell',
    templateUrl: './notification-bell.component.html',
    styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {

    notifications: NotificationItem[] = [];
    unreadCount = 0;
    panelOpen   = false;

    private subs = new Subscription();

    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.subs.add(
            this.notificationService.notifications$.subscribe((list: NotificationItem[]) => this.notifications = list)
        );
        this.subs.add(
            this.notificationService.unreadCount$.subscribe((count: number) => this.unreadCount = count)
        );

        this.notificationService.loadAll().subscribe();
        this.notificationService.loadUnreadCount().subscribe();
    }

    togglePanel(): void {
        this.panelOpen = !this.panelOpen;
    }

    markAllRead(): void {
        this.notificationService.markAllAsRead().subscribe();
    }

    onClickNotification(n: NotificationItem): void {
        if (!n.isRead) {
            this.notificationService.markOneAsRead(n.id).subscribe();
        }
        this.panelOpen = false;
        if (n.link) {
            this.router.navigateByUrl(n.link);
        }
    }

    timeAgo(iso: string): string {
        const diff  = Date.now() - new Date(iso).getTime();
        const mins  = Math.floor(diff / 60000);
        if (mins < 1)  return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs  < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}