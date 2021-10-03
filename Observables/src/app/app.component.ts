import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  isActivated: boolean = false;
  constructor(private appService: AppService) {}
  ngOnDestroy(): void {
    this.appService.activatedEmitter.unsubscribe();
  }

  ngOnInit() {
    this.appService.activatedEmitter.subscribe(
      (activateStatus) => (this.isActivated = activateStatus)
    );
  }
}
