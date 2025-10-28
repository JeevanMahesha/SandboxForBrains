import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/profiles-list/profiles-list'),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/add-profile/add-profile'),
  },
];
