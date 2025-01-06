import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AboutComponent } from "./about/about.component";

import { WelcomeComponent } from "./welcome/welcome.component";

const routes: Route[] = [
  {
    path: "",
    component: WelcomeComponent,
  },
  {
    path: "about",
    // component: AboutComponent,
    // this will work only for standalone components
    loadComponent: () => {
      return import("./about/about.component").then((m) => m.AboutComponent);
    },
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard-routing.module").then(
        (mod) => mod.dashboardComponentRoutes
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
