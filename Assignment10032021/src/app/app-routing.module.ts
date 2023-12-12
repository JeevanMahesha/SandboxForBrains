import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpcallsComponent } from './httpcalls/httpcalls.component';
import { PosthttpcallComponent } from './posthttpcall/posthttpcall.component';
import { TwowaybindingComponent } from './twowaybinding/twowaybinding.component';

const routers: Routes = [
  { 'path': 'twb', component: TwowaybindingComponent },
  { 'path': 'twb', component: AppComponent },
  { 'path': 'getapi', component: HttpcallsComponent },
  { 'path': 'getapi/:id', component: HttpcallsComponent },
  { 'path': 'postapi', component: PosthttpcallComponent }
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routers)
  ]
})
export class AppRoutingModule { }
