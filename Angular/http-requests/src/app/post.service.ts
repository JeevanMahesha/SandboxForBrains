import {
	HttpClient,
	HttpEventType,
	HttpHeaders,
	HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
	IFireBaseResponse,
	IPostData,
	IPostDataAPIResponse,
} from "./app.model";

@Injectable({ providedIn: "root" })
export class PostService {
	fireBaseURL =
		"https://angulardemoapi-4fa31-default-rtdb.asia-southeast1.firebasedatabase.app/";
	jsonFileName = ".json";

	constructor(private http: HttpClient) {}

	private getUrl(path: string): string {
		return this.fireBaseURL + path + this.jsonFileName;
	}

	createNewPost(newPost: IPostData) {
		const url = this.getUrl("posts");
		return this.http.post<{ name: string }>(url, newPost, {
			observe: "response",
		});
	}

	fetchAllPosts(): Observable<IPostDataAPIResponse[]> {
		let searchParams = new HttpParams();
		// if you want multiple params
		searchParams = searchParams.append("print", "pretty");
		searchParams = searchParams.append("key", "value");
		console.log(searchParams);

		return this.http
			.get<IFireBaseResponse>(this.getUrl("posts"), {
				headers: new HttpHeaders({ "custom-header": "jeevan" }),
				params: new HttpParams().set("print", "pretty"),
				responseType: "json",
			})
			.pipe(
				map((response): IPostDataAPIResponse[] => {
					return Object.entries(response).map(([id, value]) => ({
						id,
						...value,
					}));
				}),
				catchError((errorMessage) => {
					// send data to analytics server
					// do your operation when error occurs
					console.log(errorMessage);
					return throwError(errorMessage.error.error);
				})
			);
	}

	deleteAllPosts(): Observable<unknown> {
		// observe: "body" gives only response body
		// responseType by default it will be as json we can change the Response Body Type
		return this.http
			.delete(this.getUrl("posts"), {
				observe: "events",
				responseType: "text",
			})
			.pipe(
				tap((event: any) => {
					// import HttpEventType
					// Type enumeration for the different kinds of HttpEvent / Response
					if (event.type === HttpEventType.Sent) {
						console.log(event.type);
					}
				})
			);
	}
}
