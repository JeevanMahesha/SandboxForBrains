import { Injectable } from "@angular/core";

@Injectable()
export class AnalyticsService {
  registerClick() {
    console.log("Clicked!");
  }
}
