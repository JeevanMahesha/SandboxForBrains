import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
	return new Observable((observer) => {
		fetch(url)
			.then((res) => res.json())
			.then((jsonValue) => {
				observer.next(jsonValue);
				observer.complete();
			})
			.catch((err) => observer.error(err));
	});
}
