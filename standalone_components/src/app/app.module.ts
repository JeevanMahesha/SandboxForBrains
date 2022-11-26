import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { DetailsComponent } from "./welcome/details/details.component";
import { WelcomeComponent } from "./welcome/welcome.component";

/* 
you need to import the component if it's stand alone component 
*/
@NgModule({
  declarations: [AppComponent, WelcomeComponent],
  imports: [BrowserModule, DetailsComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
