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
		this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
	}

	ngAfterViewInit() {
		const searchLesson$ = fromEvent(this.input.nativeElement, "keyup").pipe(
			map((event: KeyboardEvent) => event.target["value"]),
			debounceTime(400),
			distinctUntilChanged(),
			switchMap(this.loadLessons.bind(this))
		);
		const initialLesson$ = this.loadLessons();
		this.lessons$ = concat(initialLesson$, searchLesson$);
	}

	loadLessons(searchInput = ""): Observable<Lesson[]> {
		return createHttpObservable(
			`/api/lessons?courseId=${this.courseId}&filter=${searchInput}`
		).pipe(map((res) => res["payload"]));
	}
}
