import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
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

	createNewPost(newPost: IPostData): Observable<{ name: string }> {
		const url = this.getUrl("posts");
		return this.http.post<{ name: string }>(url, newPost);
	}

	fetchAllPosts(): Observable<IPostDataAPIResponse[]> {
		return this.http
			.get<IFireBaseResponse>(this.getUrl("posts"), {
				headers: new HttpHeaders({ "custom-header": "jeevan" }),
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
		return this.http.delete(this.getUrl("posts"));
	}
}
