import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateplaylistComponent } from './createplaylist/createplaylist.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { UpdateplaylistComponent } from './updateplaylist/updateplaylist.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'playlist',
    component: PlaylistComponent
  },
  {
    path: 'createplaylist',
    component: CreateplaylistComponent
  },
  {
    path: 'updateplaylist',
    component: UpdateplaylistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
