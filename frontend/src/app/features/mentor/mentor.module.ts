import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MentorDashboardComponent } from './mentor-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: MentorDashboardComponent }
];

@NgModule({
  declarations: [MentorDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class MentorModule {}
