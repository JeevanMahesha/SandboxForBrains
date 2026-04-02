import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guard/authentication.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login'),
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadComponent: () => import('./components/profiles-list/profiles-list'),
    canActivate: [authGuard],
  },
];
