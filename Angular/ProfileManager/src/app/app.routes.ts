import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guard/authentication.guard';
import { legacyCreateRedirectGuard } from './guard/legacy-create.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login'),
    canActivate: [loginGuard],
  },
  {
    path: 'profiles/new',
    loadComponent: () => import('./components/profile-wizard/profile-wizard'),
    canActivate: [authGuard],
  },
  {
    path: '',
    loadComponent: () => import('./components/profiles-list/profiles-list'),
    canActivate: [authGuard, legacyCreateRedirectGuard],
  },
];
