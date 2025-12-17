import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { UserRole } from '../interfaces/auth.interface';

export const instructorGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  console.log('[InstructorGuard] User:', user);
  console.log('[InstructorGuard] User role:', user?.role, 'type:', typeof user?.role);

  if (!user) {
    console.log('[InstructorGuard] No user found');
    router.navigate(['/login']);
    return false;
  }

  // Normalize role to handle both string and number values
  const userRole = String(user.role).toLowerCase();
  
  // Allow Instructor and Admin roles
  if (userRole === 'instructor' || userRole === '1' || 
      userRole === 'admin' || userRole === '0') {
    console.log('[InstructorGuard] Access granted for role:', userRole);
    return true;
  }

  // Redirect to appropriate dashboard if not instructor or admin
  if (userRole === 'student' || userRole === '2') {
    console.log('[InstructorGuard] User is student, redirecting to /student');
    router.navigate(['/student']);
  } else {
    console.log('[InstructorGuard] Access denied, redirecting to login');
    router.navigate(['/login']);
  }
  return false;
};
