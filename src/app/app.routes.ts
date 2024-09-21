import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('../app/products-section/products-section.component'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../app/products-details/products-details.component'),
      },
      {
        path: 'add-product',
        loadComponent: () => import('../app/add-product/add-product.component'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
];
