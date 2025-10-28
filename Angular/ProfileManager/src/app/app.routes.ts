import { Routes } from '@angular/router';
import { AddProfileComponent } from './components/add-profile/add-profile';
import { ProfilesList } from './components/profiles-list/profiles-list';

export const routes: Routes = [
  {
    path: '',
    component: ProfilesList,
  },
  {
    path: 'add-profile',
    component: AddProfileComponent,
  },
];
