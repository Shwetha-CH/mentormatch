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
        this.notificationService.loadAll().subscribe({
            next: (list: NotificationItem[]) => {
                this.notifications = list;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    onClickNotification(n: NotificationItem): void {
        if (!n.isRead) {
            this.notificationService.markOneAsRead(n.id).subscribe({
                next: () => { n.isRead = true; }
            });
        }
        if (n.link) {
            this.router.navigateByUrl(n.link);
        }
    }

    markAllRead(): void {
        this.notificationService.markAllAsRead().subscribe({
            next: () => {
                this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
            }
        });
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
}
