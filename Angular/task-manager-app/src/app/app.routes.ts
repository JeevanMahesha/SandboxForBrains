import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'task',
    loadComponent: () => import('./task-list/task-list.component'),
  },
  {
    path: 'about',
    loadComponent: () => import('./about-task/about-task.component'),
  },
  {
    path: '',
    redirectTo: 'task',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found.component'),
  },
];
