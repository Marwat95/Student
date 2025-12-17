import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { UserRole } from '../interfaces/auth.interface';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  console.log('[AdminGuard] User:', user);
  console.log('[AdminGuard] User role:', user?.role, 'type:', typeof user?.role);

  if (!user) {
    console.log('[AdminGuard] No user found');
    router.navigate(['/login']);
    return false;
  }

  // Normalize role to handle both string and number values
  const userRole = String(user.role).toLowerCase();
  
  // Allow only Admin role
  if (userRole === 'admin' || userRole === '0') {
    console.log('[AdminGuard] Access granted for role:', userRole);
    return true;
  }

  // Redirect to appropriate dashboard if not admin
  if (userRole === 'student' || userRole === '2') {
    console.log('[AdminGuard] User is student, redirecting to /student');
    router.navigate(['/student']);
  } else if (userRole === 'instructor' || userRole === '1') {
    console.log('[AdminGuard] User is instructor, redirecting to /instructor');
    router.navigate(['/instructor']);
  } else {
    console.log('[AdminGuard] Access denied, redirecting to login');
    router.navigate(['/login']);
  }
  return false;
};
