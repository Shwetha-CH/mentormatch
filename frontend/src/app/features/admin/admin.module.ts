// src/app/features/admin/admin.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { AdminDashboardComponent } from './admin-dashboard.component';
import { OverviewComponent } from './components/overview/overview.component';
import { StudentsComponent } from './components/students/students.component';
import { MentorsComponent } from './components/mentors/mentors.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    OverviewComponent,
    StudentsComponent,
    MentorsComponent,
    SessionsComponent,
    ReviewsComponent,
    BroadcastComponent,
    StatCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // For [(ngModel)] in sessions filter
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }