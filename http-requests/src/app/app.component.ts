import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IPostData, IPostDataAPIResponse } from "./app.model";
import { PostService } from "./post.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	loadedPosts: IPostData[] = [];

	isLoading = false;

	constructor(private http: HttpClient, private postService: PostService) {}

	ngOnInit() {
		this.onFetchPosts();
	}

	onCreatePost(postData: IPostData) {
		// Send Http request
		this.postService.createNewPost(postData).subscribe((response) => {
			console.log(response);
		});
	}

	onFetchPosts() {
		// Send Http request
		this.isLoading = true;
		this.postService
			.fetchAllPosts()
			.subscribe((response: IPostDataAPIResponse[]) => {
				this.loadedPosts = response;
				this.isLoading = false;
			});
	}

	onClearPosts() {
		// Send Http request
	}
}
