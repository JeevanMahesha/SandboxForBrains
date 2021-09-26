import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ServersComponent } from "./servers/servers.component";
import { UserComponent } from "./users/user/user.component";
import { UsersComponent } from "./users/users.component";

const appRouting: Routes = [
  { path: "", component: HomeComponent },
  { path: "users", component: UsersComponent },
  { path: "users/:id", component: UserComponent },
  { path: "servers", component: ServersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRouting)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
