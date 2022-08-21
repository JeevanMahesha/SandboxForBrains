import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ShortenPipe } from "./CustomPipes/shorten.pipe";
import { FilterPipe } from './CustomPipes/filter.pipe';

@NgModule({
	declarations: [AppComponent, ShortenPipe, FilterPipe],
	imports: [BrowserModule, FormsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
