import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MentorDashboardComponent } from './mentor-dashboard.component';
import { MentorNotificationsComponent } from './notifications/notifications.component';
const routes: Routes = [
  { path: 'dashboard', component: MentorDashboardComponent },
  { path: 'notifications', component: MentorNotificationsComponent }

];

@NgModule({
  declarations: [MentorDashboardComponent,
      MentorNotificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MentorModule {}
