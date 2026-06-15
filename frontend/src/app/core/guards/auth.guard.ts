import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const loggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard: is user logged in?', loggedIn);
    if (loggedIn) {
      return true;
    }
    console.log('AuthGuard: redirecting to login');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
