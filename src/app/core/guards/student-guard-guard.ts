import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { UserRole } from '../interfaces/auth.interface';

export const studentGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  console.log('[StudentGuard] Checking access to:', state.url);
  console.log('[StudentGuard] Is authenticated:', tokenService.isAuthenticated());

  if (!tokenService.isAuthenticated()) {
    console.log('[StudentGuard] Not authenticated, redirecting to login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  console.log('[StudentGuard] User:', user);
  console.log('[StudentGuard] User role type:', typeof user?.role, 'Value:', user?.role);

  if (!user) {
    console.log('[StudentGuard] No user found');
    router.navigate(['/login']);
    return false;
  }

  // Normalize role to handle both string and number values
  const userRole = String(user.role).toLowerCase();
  
  // Allow Student and Admin roles
  if (userRole === 'student' || userRole === '2' || 
      userRole === 'admin' || userRole === '0') {
    console.log('[StudentGuard] Access granted for role:', userRole);
    return true;
  }

  // Redirect to appropriate dashboard if not student or admin
  if (userRole === 'instructor' || userRole === '1') {
    console.log('[StudentGuard] User is instructor, redirecting to /instructor');
    router.navigate(['/instructor']);
  } else {
    console.log('[StudentGuard] Access denied, redirecting to login');
    router.navigate(['/login']);
  }
  return false;
};
