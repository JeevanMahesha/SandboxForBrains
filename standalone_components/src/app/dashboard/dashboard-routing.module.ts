import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";
import { TodayComponent } from "./today/today.component";

export const dashboardComponentRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "today",
    component: TodayComponent,
  },
];
