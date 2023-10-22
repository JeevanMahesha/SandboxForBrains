import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
	debounceTime,
	distinctUntilChanged,
	startWith,
	tap,
	delay,
	map,
	concatMap,
	switchMap,
	withLatestFrom,
	concatAll,
	shareReplay,
	mergeMap,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, of } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { debug, RxJsLoggingLevel } from "../common/debug";

@Component({
	selector: "course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
	course$: Observable<Course>;
	lessons$: Observable<Lesson[]>;
	courseId: string;

	@ViewChild("searchInput", { static: true }) input: ElementRef;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.courseId = this.route.snapshot.params["id"];
		this.course$ = createHttpObservable(`/api/courses/${this.courseId}`).pipe(
			debug(RxJsLoggingLevel.INFO, "course value")
		);
	}

	ngAfterViewInit() {
		this.lessons$ = fromEvent(this.input.nativeElement, "keyup").pipe(
			map((event: KeyboardEvent) => event.target["value"]),
			debug(RxJsLoggingLevel.TRACE, "search"),
			startWith(""),
			debounceTime(400),
			distinctUntilChanged(),
			switchMap(this.loadLessons.bind(this)),
			debug(RxJsLoggingLevel.DEBUG, "Lessons value")
		);

		// const initialLesson$ = this.loadLessons();
		// this.lessons$ = concat(initialLesson$, searchLesson$);
	}

	loadLessons(searchInput = ""): Observable<Lesson[]> {
		return createHttpObservable(
			`/api/lessons?courseId=${this.courseId}&filter=${searchInput}`
		).pipe(map((res) => res["payload"]));
	}
}
