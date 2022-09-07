import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
	return new Observable((observer) => {
		const controller = new AbortController();
		const signal = controller.signal;
		fetch(url, { signal })
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return observer.error(
						"Request failed with status code: " + res.status
					);
				}
			})
			.then((jsonValue) => {
				observer.next(jsonValue);
				observer.complete();
			})
			.catch((err) => observer.error(err));
		return () => controller.abort();
	});
}
