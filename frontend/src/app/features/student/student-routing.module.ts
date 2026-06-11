import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './pages/dashboard/student-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
