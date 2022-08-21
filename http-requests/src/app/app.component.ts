import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {
	IFireBaseResponse,
	IPostData,
	IPostDataAPIResponse,
} from "./app.model";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	loadedPosts: IPostData[] = [];
	fireBaseURL =
		"https://angulardemoapi-4fa31-default-rtdb.asia-southeast1.firebasedatabase.app/";
	jsonFileName = ".json";

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.fetchAllPosts();
	}

	onCreatePost(postData: IPostData) {
		// Send Http request
		console.log(postData);
		const url = this.getUrl("posts");
		this.http.post<{ name: string }>(url, postData).subscribe((response) => {
			console.log(response);
		});
	}

	onFetchPosts() {
		// Send Http request
		this.fetchAllPosts();
	}

	onClearPosts() {
		// Send Http request
	}

	private fetchAllPosts() {
		this.http
			.get<IFireBaseResponse>(this.getUrl("posts"))
			.pipe(
				map((response): IPostDataAPIResponse[] => {
					return Object.entries(response).map(([id, value]) => ({
						id,
						...value,
					}));
				})
			)
			.subscribe((response: IPostDataAPIResponse[]) => {
				this.loadedPosts = response;
			});
	}

	private getUrl(path: string): string {
		return this.fireBaseURL + path + this.jsonFileName;
	}
}
