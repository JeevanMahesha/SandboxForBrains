import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
	TRACE,
	DEBUG,
	INFO,
	ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.TRACE;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
	rxjsLoggingLevel = level;
}

export const debug =
	(logLevel: number, message: string) => (source: Observable<any>) =>
		source.pipe(
			tap((value) => {
				if (logLevel >= rxjsLoggingLevel) {
					console.log(message + " ", value);
				}
			})
		);
