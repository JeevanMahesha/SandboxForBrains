import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Uses token-based authentication check with async validation
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthInit();

  const isSyncAuthenticated = authService.isAuthenticated();

  if (isSyncAuthenticated) {
    const isTokenValid = await authService.isTokenValid();

    if (isTokenValid) {
      return true;
    }
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

/**
 * Login Guard - Prevents authenticated users from accessing login page
 */
export const loginGuard: CanActivateFn = async (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthInit();

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
