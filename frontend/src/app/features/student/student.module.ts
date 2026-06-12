import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentRoutingModule } from './student-routing.module';

import { StudentDashboardComponent } from './pages/dashboard/student-dashboard.component';
import { StudentProfileComponent } from './pages/profile/student-profile.component';
import { BrowseMentorsComponent } from './pages/browse-mentors/browse-mentors.component';
import { MentorDetailComponent } from './pages/mentor-detail/mentor-detail.component';
import { MySessionsComponent } from './pages/my-sessions/my-sessions.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    StudentProfileComponent,
    BrowseMentorsComponent,
    MentorDetailComponent,
    MySessionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StudentRoutingModule
  ]
})
export class StudentModule {}
