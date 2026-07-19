import { Routes } from '@angular/router';

export const v2Routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login-v2'),
  },
  {
    path: '',
    loadComponent: () => import('./profiles-list/profiles-list-v2'),
  },
];
