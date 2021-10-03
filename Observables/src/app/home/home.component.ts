import { Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscribeValue: Subscription;
  constructor() {}
  ngOnDestroy(): void {
    this.subscribeValue.unsubscribe();
  }

  ngOnInit() {
    this.subscribeValue = interval(1000).subscribe((count: number) => {
      console.log(count);
    });
  }
}
