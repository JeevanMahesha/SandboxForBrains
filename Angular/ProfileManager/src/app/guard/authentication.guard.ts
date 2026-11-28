import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthInit();

  if (authService.isAuthenticated()) {
    return true;
  }

  // Returning a UrlTree makes this a redirect, so the guarded URL is replaced in the history
  // instead of leaving a back-button trap behind it.
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const loginGuard: CanActivateFn = async (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthInit();

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
