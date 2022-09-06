import { Component, OnInit } from "@angular/core";
import { noop } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Course } from "../model/course";

@Component({
	selector: "home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	beginnersCourses: Course[] = [];
	advancedCourses: Course[] = [];

	constructor() {}

	ngOnInit() {
		// RXJS stands for Reactive Extensions for JavaScript
		const http$ = createHttpObservable("/api/courses");
		const courses$ = http$.pipe(map((res) => res["payload"]));
		courses$.subscribe(
			(courses: Course[]) => {
				this.beginnersCourses = courses.filter(
					(eachCourse) => eachCourse.category === "BEGINNER"
				);

				this.advancedCourses = courses.filter(
					(eachCourse) => eachCourse.category === "ADVANCED"
				);
			},
			noop,
			() => console.log("completed")
		);
	}
}
