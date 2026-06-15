// src/app/features/admin/components/overview/overview.component.ts

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminStats } from '../../models/admin-stats.model';
import { AdminUserDetail } from '../../models/admin-user.model';
import { AdminSession } from '../../models/admin-session.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  
  @ViewChild('usersPieChart') usersPieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sessionsBarChart') sessionsBarChartRef!: ElementRef<HTMLCanvasElement>;
  
  stats: AdminStats | null = null;
  topMentors: AdminUserDetail[] = [];
  recentSessions: AdminSession[] = [];
  loading: boolean = true;
  error: string | null = null;

  private usersPieChart: Chart | null = null;
  private sessionsBarChart: Chart | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data loads
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load all data
    this.adminService.getStats().subscribe({
      next: (statsData) => {
        this.stats = statsData;
        
        // Load top mentors
        this.adminService.getTop5Mentors().subscribe({
          next: (mentors) => {
            this.topMentors = mentors;
          },
          error: (err) => console.error('Error loading top mentors:', err)
        });

        // Load recent sessions
        this.adminService.getRecentSessions().subscribe({
          next: (sessions) => {
            this.recentSessions = sessions;
          },
          error: (err) => console.error('Error loading recent sessions:', err)
        });

        this.loading = false;
        setTimeout(() => this.createCharts(), 0);
      },
      error: (err) => {
        this.error = 'Failed to load statistics. Please try again.';
        this.loading = false;
        console.error('Error loading stats:', err);
      }
    });
  }

  createCharts(): void {
    if (!this.stats) return;
    this.createUsersPieChart();
    this.createSessionsBarChart();
  }

  createUsersPieChart(): void {
    if (!this.stats || !this.usersPieChartRef) return;

    if (this.usersPieChart) {
      this.usersPieChart.destroy();
    }

    const ctx = this.usersPieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.usersPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Students', 'Mentors'],
        datasets: [{
          data: [this.stats.totalStudents, this.stats.totalMentors],
          backgroundColor: ['#667eea', '#f093fb'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              font: { size: 13 },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#1a1a1a',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 8,
            displayColors: false
          }
        },
        cutout: '65%'
      }
    });
  }

  createSessionsBarChart(): void {
    if (!this.stats || !this.sessionsBarChartRef) return;

    if (this.sessionsBarChart) {
      this.sessionsBarChart.destroy();
    }

    const ctx = this.sessionsBarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.sessionsBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total', 'Completed', 'Pending'],
        datasets: [{
          data: [
            this.stats.totalSessions,
            this.stats.completedSessions,
            this.stats.pendingSessions
          ],
          backgroundColor: ['#f59e0b', '#10b981', '#3b82f6'],
          borderRadius: 8,
          barThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { font: { size: 12 }, color: '#6b7280' },
            grid: { color: '#f3f4f6' },
            border: { display: false }
          },
          x: {
            ticks: { font: { size: 13 }, color: '#1a1a1a' },
            grid: { display: false }
          }
        }
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'ACCEPTED': 'status-accepted',
      'COMPLETED': 'status-completed',
      'REJECTED': 'status-rejected',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }
}