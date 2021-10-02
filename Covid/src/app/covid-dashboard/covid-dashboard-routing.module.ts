import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidDashboardComponent } from './covid-dashboard.component';
import { GraphsComponent } from './graphs/graphs.component';
import { PageNotFoundComponent } from '../Shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {path:'',component:CovidDashboardComponent},
  {path:'country',component:GraphsComponent},
  {path:"**",component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidDashboardRoutingModule { }
