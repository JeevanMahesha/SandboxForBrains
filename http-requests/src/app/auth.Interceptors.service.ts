import {
	HttpEvent,
	HttpHandler,
	HttpHeaders,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class AuthInterceptorsService implements HttpInterceptor {
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		console.log("Request is on the way");
		const modifiedRequest = req.clone({
			headers: new HttpHeaders().append("Auth", "XYZ"),
		});
		return next.handle(modifiedRequest);
	}
}
