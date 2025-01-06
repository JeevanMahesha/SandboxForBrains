import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'injectDestroy',
    loadComponent: () =>
      import('../app/inject-destroy/inject-destroy.component'),
  },
];
