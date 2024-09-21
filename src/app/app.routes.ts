import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-detail-list-view/user-detail-list-view.component'),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
];
