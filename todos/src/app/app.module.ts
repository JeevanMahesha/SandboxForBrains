import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ListTodosComponent } from './list-todos/list-todos.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateComponent } from './create/create.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EditTodosComponent } from './edit-todos/edit-todos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListTodosComponent,
    CreateComponent,
    EditTodosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
