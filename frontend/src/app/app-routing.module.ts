import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'STUDENT' },
    loadChildren: () => import('./features/student/student.module').then(m => m.StudentModule)
  },
  {
    path: 'mentor',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'MENTOR' },
    loadChildren: () => import('./features/mentor/mentor.module').then(m => m.MentorModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
