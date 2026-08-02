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

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

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
