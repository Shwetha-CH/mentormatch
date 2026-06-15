import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = (route.data['role'] || '').toUpperCase().trim();
    const userRole = (this.authService.getRole() || '').toUpperCase().trim();
    
    console.log(`RoleGuard: checking requiredRole: ${requiredRole} against userRole: ${userRole}`);

    if (userRole === requiredRole) {
      console.log('RoleGuard: access granted');
      return true;
    }

    console.log('RoleGuard: access denied, redirecting to dashboard');
    // Redirect to their own dashboard instead of a blank page
    this.authService.redirectToDashboard();
    return false;
  }
}
