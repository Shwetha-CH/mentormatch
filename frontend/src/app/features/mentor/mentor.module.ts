import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MentorDashboardComponent } from './mentor-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: MentorDashboardComponent }
];

@NgModule({
  declarations: [MentorDashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MentorModule {}
