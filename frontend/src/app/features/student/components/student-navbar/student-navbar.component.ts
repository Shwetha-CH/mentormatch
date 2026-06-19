// src/app/features/student/components/student-navbar/student-navbar.component.ts

import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-student-navbar',
    templateUrl: './student-navbar.component.html',
    styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent {

    unreadCount = 0;
    currentRoute = '';
    showDropdown = false;

    navItems = [
        { label: 'Dashboard',       icon: '🏠', route: '/student/dashboard'      },
        { label: 'Browse Mentors',  icon: '🔍', route: '/student/mentors'        },
        { label: 'My Sessions',     icon: '📅', route: '/student/sessions'       },
        { label: 'Notifications',   icon: '🔔', route: '/student/notifications'  },
        { label: 'Edit Profile',    icon: '✏️',  route: '/student/profile'        },
    ];

    constructor(
        private router: Router,
        private authService: AuthService,
        private notificationService: NotificationService
    ) {
        // Track active route
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: any) => {
                this.currentRoute = e.urlAfterRedirects;
            });
        this.currentRoute = this.router.url;

        // Subscribe to unread count
        this.notificationService.unreadCount$.subscribe(count => {
            this.unreadCount = count;
        });

        this.notificationService.loadUnreadCount().subscribe();
    }

    navigate(route: string): void {
        this.router.navigate([route]);
    }

    isActive(route: string): boolean {
        return this.currentRoute.startsWith(route);
    }

    toggleDropdown(): void  { this.showDropdown = !this.showDropdown; }
    closeDropdown(): void   { this.showDropdown = false; }

    get fullName(): string {
        return this.authService.getFullName() || 'Student';
    }

    get email(): string {
        return this.authService.getUserData()?.email || '';
    }

    get initials(): string {
        return this.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }

    logout(): void {
        this.showDropdown = false;
        this.authService.logout();
    }
}