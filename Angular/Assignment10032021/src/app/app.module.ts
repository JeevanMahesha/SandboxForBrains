import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TwowaybindingComponent } from './twowaybinding/twowaybinding.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpcallsComponent } from './httpcalls/httpcalls.component';
import { PosthttpcallComponent } from './posthttpcall/posthttpcall.component';

@NgModule({
  declarations: [
    AppComponent,
    TwowaybindingComponent,
    HttpcallsComponent,
    PosthttpcallComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
