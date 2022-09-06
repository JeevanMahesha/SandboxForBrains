import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
	return new Observable((observer) => {
		const controller = new AbortController();
		const signal = controller.signal;
		fetch(url, { signal })
			.then((res) => res.json())
			.then((jsonValue) => {
				observer.next(jsonValue);
				observer.complete();
			})
			.catch((err) => observer.error(err));
		return () => controller.abort();
	});
}
