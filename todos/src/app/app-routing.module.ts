import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { EditTodosComponent } from "./edit-todos/edit-todos.component";
import { ListTodosComponent } from "./list-todos/list-todos.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "list", component: ListTodosComponent },
  { path: "create", component: CreateComponent },
  { path: "edit", component: EditTodosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
