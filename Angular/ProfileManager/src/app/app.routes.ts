import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guard/authentication.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./v2/login/login-v2'),
    canActivate: [loginGuard],
  },
  {
    path: '',
     loadComponent: () => import('./v2/profiles-list/profiles-list-v2'),
    canActivate: [authGuard],
  },
];
