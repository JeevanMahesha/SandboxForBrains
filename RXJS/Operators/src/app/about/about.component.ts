import { Component, OnInit } from "@angular/core";
import { noop } from "rxjs";
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
		// RXJS stands for Reactive Extensions for JavaScript
		const http$ = createHttpObservable("/api/courses");
		const courses$ = http$.pipe(map((res) => res["payload"]));
		courses$.subscribe(
			(arg: any) => console.log(arg),
			noop,
			() => console.log("completed")
		);
	}
}
