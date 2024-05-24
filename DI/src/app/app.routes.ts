import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'useClass',
    loadComponent: () => import('./use-class/use-class.component'),
  },
  {
    path: 'useExisting',
    loadComponent: () => import('./use-existing/use-existing.component'),
  },
  {
    path: 'useFactory',
    loadComponent: () => import('./use-factory/use-factory.component'),
  },
];
