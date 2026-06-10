import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.authService.getRole();

    if (userRole === requiredRole) {
      return true;
    }

    // Redirect to their own dashboard instead of a blank page
    this.authService.redirectToDashboard();
    return false;
  }
}
