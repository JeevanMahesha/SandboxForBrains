import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/authentication.guard';

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
  {
    path: 'profile',
    loadComponent: () => import('./components/add-profile/add-profile'),
    canActivate: [authGuard],
  },
  {
    path: 'matching-stars',
    loadComponent: () => import('./components/matching-stars/matching-stars'),
    canActivate: [authGuard],
  },
  {
    path: 'zodiac-list',
    loadComponent: () => import('./components/zodiac-list/zodiac-list'),
    canActivate: [authGuard],
  },
];
