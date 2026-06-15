// src/app/features/admin/admin-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { OverviewComponent } from './components/overview/overview.component';
import { StudentsComponent } from './components/students/students.component';
import { MentorsComponent } from './components/mentors/mentors.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    // Guards are already checked at parent level (/admin)
    // Don't check again here
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'mentors', component: MentorsComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'broadcast', component: BroadcastComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }