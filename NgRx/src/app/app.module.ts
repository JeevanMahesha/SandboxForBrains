import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { StoreModule } from "@ngrx/store";
import { AppComponent } from "./app.component";
import { CounterControlsComponent } from "./counter-controls/counter-controls.component";
import { CounterOutputComponent } from "./counter-output/counter-output.component";
import { counterReducer } from "./store/counter.reducer";
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    CounterOutputComponent,
    CounterControlsComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(
      {
        counter: counterReducer,
      },
      {}
    ),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
