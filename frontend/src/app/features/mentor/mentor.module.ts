import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MentorDashboardComponent } from './mentor-dashboard.component';
import { MentorNotificationsComponent } from './notifications/notifications.component';
import {FooterComponent} from "./footer/footer.component";

const routes: Routes = [
  { path: 'dashboard', component: MentorDashboardComponent },
  { path: 'notifications', component: MentorNotificationsComponent }
];

@NgModule({
  declarations: [
    MentorDashboardComponent,
    MentorNotificationsComponent,
      FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class MentorModule {}
