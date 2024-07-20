import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'zoneless',
    pathMatch: 'full',
  },
  {
    path: 'zoneless',
    loadComponent: () => import('./zoneless/zoneless.component'),
  },
];
