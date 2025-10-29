import { Component } from "@angular/core";
import { AnalyticsService } from "src/app/shared/analytics.service";
import { HighlightDirective } from "src/app/shared/highlight.directive";

/* 
if your using any specific module for standalone component us need to import it 
for that component ex:- SharedModule 
*/
@Component({
  standalone: true,
  imports: [HighlightDirective],
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
  providers: [AnalyticsService],
})
export class DetailsComponent {
  constructor(private analyticsService: AnalyticsService) {}

  onClick() {
    this.analyticsService.registerClick();
  }
}
