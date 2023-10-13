import { Component, OnInit } from "@angular/core";
import { noop, Observable, throwError, timer } from "rxjs";
import {
	catchError,
	delay,
	delayWhen,
	finalize,
	map,
	retryWhen,
	shareReplay,
	tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Course } from "../model/course";

@Component({
	selector: "home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	beginnersCourses$: Observable<Course[]>;
	advancedCourses$: Observable<Course[]>;

	constructor() {}

	ngOnInit() {
		// RXJS stands for Reactive Extensions for JavaScript
		// ! shareReplay will make a call once to take the data and give the subscribe variable when every / how many times they subscribe
		const http$ = createHttpObservable("/api/courses");
		const courses$: Observable<Course[]> = http$.pipe(
			tap(() => console.info("HTTP Execution Done")),
			map((res) => res["payload"]),
			shareReplay(),
			retryWhen((error) => error.pipe(delayWhen(() => timer(2000))))
		);
		this.beginnersCourses$ = courses$.pipe(
			map((courses) =>
				courses.filter((eachCourse) => eachCourse.category === "BEGINNER")
			)
		);
		this.advancedCourses$ = courses$.pipe(
			map((courses) =>
				courses.filter((eachCourse) => eachCourse.category === "ADVANCED")
			)
		);
	}
}
