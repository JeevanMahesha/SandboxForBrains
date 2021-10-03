import { Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Observable, Observer, Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscribeValue: Subscription;
  private customObservableValue: Subscription;
  constructor() {}
  ngOnDestroy(): void {
    // this.subscribeValue.unsubscribe();
    this.customObservableValue.unsubscribe();
  }

  ngOnInit() {
    // this.subscribeValue = interval(1000).subscribe((count: number) => {
    //   console.log(count);
    // });
    this.customObservable();
  }

  customObservable(): void {
    const obs = Observable.create((observer: Observer<any>) => {
      let count = 0;
      setInterval(() => {
        if (count > 3) {
          observer.error("Count greater than 3");
        }
        if (count === 3) {
          observer.complete();
        }
        observer.next(count);
        count++;
      }, 1000);
    });
    this.customObservableValue = obs.subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        alert(error);
        console.log(error);
      },
      () => {
        console.log("Observable Completed");
      }
    );
  }
}
