import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { ProductService } from './service/product.service';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('../app/products-section/products-section.component'),
    canActivateChild: [authGuard],
    providers: [ProductService],
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
      {
        path: 'cart',
        loadComponent: () =>
          import('../app/shopping-cart/shopping-cart.component'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
];
