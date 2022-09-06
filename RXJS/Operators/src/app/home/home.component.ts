import { Component, OnInit } from "@angular/core";
import { noop, Observable } from "rxjs";
import { map } from "rxjs/operators";
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
		const http$ = createHttpObservable("/api/courses");
		const courses$: Observable<Course[]> = http$.pipe(
			map((res) => res["payload"])
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
