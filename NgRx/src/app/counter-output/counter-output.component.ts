import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { doubleSelectCount, selectCount } from "../store/counter.select";

@Component({
  selector: "app-counter-output",
  templateUrl: "./counter-output.component.html",
  styleUrls: ["./counter-output.component.css"],
})
export class CounterOutputComponent {
  counter$: Observable<number> | null = null;
  doubleCounter$: Observable<number> | null = null;
  private store = inject(Store<{ counter: number }>);
  constructor() {
    this.counter$ = this.store.select(selectCount);
    this.doubleCounter$ = this.store.select(doubleSelectCount)
  }
}
