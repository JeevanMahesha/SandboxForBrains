import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'useClass',
    loadComponent: () => import('./use-class/use-class.component'),
  },
];
