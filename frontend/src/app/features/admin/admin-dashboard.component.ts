// src/app/features/admin/admin-dashboard.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  
  menuItems = [
    { label: 'Overview', icon: '📊', route: '/admin/dashboard/overview' },
    { label: 'Students', icon: '👨‍🎓', route: '/admin/dashboard/students' },
    { label: 'Mentors', icon: '👨‍🏫', route: '/admin/dashboard/mentors' },
    { label: 'Sessions', icon: '📅', route: '/admin/dashboard/sessions' },
    { label: 'Reviews', icon: '⭐', route: '/admin/dashboard/reviews' },
    { label: 'Broadcast', icon: '📢', route: '/admin/dashboard/broadcast' }
  ];

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('access_token');      // ✅ Fixed key name
    localStorage.removeItem('refresh_token');     // ✅ Clear this too
    localStorage.removeItem('user_data');         // ✅ Clear this too
    this.router.navigate(['/auth/login']);        // ✅ Fixed route
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}