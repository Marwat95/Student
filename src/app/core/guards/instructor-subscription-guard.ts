import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { SubscriptionService } from '../services/SubscriptionService/subscription-service';
import { UserRole } from '../interfaces/auth.interface';

export const instructorSubscriptionGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  if (!user || !user.userId) {
    router.navigate(['/login']);
    return false;
  }

  // Normalize role to check if instructor
  const userRole = String(user.role).toLowerCase();
  const isInstructor = userRole === 'instructor' || userRole === '1';

  if (!isInstructor) {
    // Non-instructors don't need subscription check
    return true;
  }

  // For instructors, check subscription status
  return new Promise<boolean>((resolve) => {
    subscriptionService.getInstructorSubscription(user.userId!).subscribe({
      next: (subscription) => {
        if (subscription && subscription.isActive) {
          // Active subscription exists
          resolve(true);
        } else {
          // No active subscription - redirect to subscription page
          router.navigate(['/instructor/subscription'], {
            queryParams: { returnUrl: state.url },
            state: { message: 'Please select a subscription plan to continue.' },
          });
          resolve(false);
        }
      },
      error: (err) => {
        // Error or no subscription found - redirect to subscription
        if (err.status === 404 || err.status === 0) {
          router.navigate(['/instructor/subscription'], {
            queryParams: { returnUrl: state.url },
            state: { message: 'Please select a subscription plan to start creating courses.' },
          });
        } else {
          console.error('Error checking subscription:', err);
          router.navigate(['/instructor']);
        }
        resolve(false);
      },
    });
  });
};
