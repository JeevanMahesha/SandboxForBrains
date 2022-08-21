import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	loadedPosts = [];
	fireBaseURL =
		"https://angulardemoapi-4fa31-default-rtdb.asia-southeast1.firebasedatabase.app/";
	jsonFileName = ".json";

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.fetchAllPosts();
	}

	onCreatePost(postData: { title: string; content: string }) {
		// Send Http request
		console.log(postData);
		const url = this.getUrl("posts");
		this.http.post(url, postData).subscribe((response) => {
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
		this.http.get(this.getUrl("posts")).subscribe((response) => {
			console.log(response);
		});
	}

	private getUrl(path: string): string {
		return this.fireBaseURL + path + this.jsonFileName;
	}
}
