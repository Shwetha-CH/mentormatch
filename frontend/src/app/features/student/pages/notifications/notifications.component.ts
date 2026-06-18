import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../models/notification.model';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    notifications: NotificationItem[] = [];
    loading = true;

    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Load from API, then stay subscribed to live BehaviorSubject
        this.notificationService.loadAll().subscribe({
            next: () => { this.loading = false; },
            error: () => { this.loading = false; }
        });
        // Always display the reactive stream (reflects markAsRead updates)
        this.notificationService.notifications$.subscribe(list => {
            this.notifications = list;
        });
    }

    onClickNotification(n: NotificationItem): void {
        if (!n.isRead) {
            this.notificationService.markOneAsRead(n.id).subscribe();
        }
        if (n.link) {
            this.router.navigateByUrl(n.link);
        }
    }

    markAllRead(): void {
        this.notificationService.markAllAsRead().subscribe();
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.isRead).length;
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
}
