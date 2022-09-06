import { Component, OnInit } from "@angular/core";
import { concat, of } from "rxjs";

@Component({
	selector: "about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}

function concatInRxjs() {
	// the concat will waiting until the pervious observable to finish
	const source1$ = of(1, 2, 3);

	const source2$ = of(4, 5, 6);

	const result$ = concat(source1$, source2$);

	result$.subscribe(console.log);
}
