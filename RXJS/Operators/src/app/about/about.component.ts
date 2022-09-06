import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { noop, Observable } from "rxjs";

@Component({
	selector: "about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		// RXJS stands for reactive ex
		const http$ = new Observable((observer) => {
			fetch("/api/courses")
				.then((res) => res.json())
				.then((jsonValue) => {
					observer.next(jsonValue);
					observer.complete();
				})
				.catch((err) => observer.error(err));
		});

		http$.subscribe(
			(arg: any) => console.log(arg),
			noop,
			() => console.log("completed")
		);
	}
}
