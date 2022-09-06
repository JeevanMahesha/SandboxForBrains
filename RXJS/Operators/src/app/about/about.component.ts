import { Component, OnInit } from "@angular/core";
import { concat, interval, merge, of } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
	selector: "about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		unSubscription();
	}
}

function unSubscription() {
	const http$ = createHttpObservable("/api/courses");
	const subscribe = http$.subscribe(console.log);
	setTimeout(() => {
		subscribe.unsubscribe();
	}, 0);
}

function mergeInRxjs() {
	const interval1$ = interval(1000);
	const interval2$ = interval1$.pipe(map((val) => 10 * val));
	const result$ = merge(interval1$, interval2$);
	result$.subscribe(console.log);
}

function concatInRxjs() {
	// the concat will waiting until the pervious observable to finish
	const source1$ = of(1, 2, 3);

	const source2$ = of(4, 5, 6);

	const result$ = concat(source1$, source2$);

	result$.subscribe(console.log);
}
